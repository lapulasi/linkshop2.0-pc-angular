import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {WebHttpClient} from "../../../web.httpclient";
import {map} from "rxjs/internal/operators";
import {Observable} from "rxjs/Rx";


@Component({
  selector: 'app-sub-org-stat',
  templateUrl: './sub-org-stat.component.html'
})
export class SubOrgStatComponent implements OnInit, OnChanges {

  @Input() cond: any;
  @Input() page: any;
  resultList$: Observable<any>;
  levelList$: Observable<any>;
  sortCond = {field: '', type: ''};
  guestTable = [{name: '客流', val: 'guestCount'}, {name: '驻留', val: 'zl'}, {name: '集客力', val: 'jk'}, {name: '坪效', val: 'px'}];
  salesTable = [{name: '销量', val: 'allVolume'}, {name: '销额', val: 'allAmount'}, {name: '客均价', val: 'jj'}, {name: '转化率', val: 'zh'}];
  deviceTable = [{name: '设备数', val: 'deviceNum'}, {name: '设备正常率', val: 'zcl'}];
  levelId: any;

  constructor(private http: WebHttpClient) { }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(this.cond);
    if (this.page === 'guest') {
      this.sortCond = {field: 'guestCount', type: 'desc'};
    } else if (this.page === 'sales') {
      this.sortCond = {field: 'allVolume', type: 'desc'};
    } else {
      this.sortCond = {field: 'deviceNum', type: 'desc'};
    }
    if (this.cond && this.cond.org) {
      this.levelId = this.cond.org.shopLevelId;
      this.levelList$ = this.http.get(`/org/code/level`, {orgCode: this.cond.org.code}).pipe(
        map(result => {
          if (result.length > 1) {
            result.shift();
          }
          return result.reverse();
        })
      );

      this.sort();
    }

  }

  onLevelIdChange(event) {
    this.sort();
  }


  sort() {
    this.resultList$ = this.http.get(`/org/regional/shop`,
      {levelId: this.levelId, orgCode: this.cond.org.code, adcode: '',
        startDate: this.cond.date.start, endDate: this.cond.date.end}).pipe(
          map(result => {
            return this.sortOperation(result);
          })
    );
  }

  sortOperation(result) {
    const field = this.sortCond.field;
    const type = this.sortCond.type;
    switch (field) {
      case 'zl' :
        return result.sort((a, b) => a.data['guestStayTime'] / a.data['guestCount'] > b.data['guestStayTime'] / b.data['guestCount'] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      case 'jk' :
        return result.sort((a, b) => a.data['guestCount'] / a.data['allShopArea'] > b.data['guestCount'] / b.data['allShopArea'] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      case 'px' :
        return result.sort((a, b) => a.data['allAmount'] / a.data['allShopArea'] > b.data['allAmount'] / b.data['allShopArea'] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      case 'jj' :
        return result.sort((a, b) => a.data['allAmount'] / a.data['guestCount'] > b.data['allAmount'] / b.data['guestCount'] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      case 'zh' :
        return result.sort((a, b) => a.data['allVolume'] / a.data['guestCount'] > b.data['allVolume'] / b.data['guestCount'] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      case 'zcl' :
        return result.sort((a, b) => a.data['goodDeviceNum'] / (a.data['goodDeviceNum'] + a.data['brokenDeviceNum']) > b.data['goodDeviceNum'] / (b.data['goodDeviceNum'] + b.data['brokenDeviceNum'])
          ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
      default:
        return result.sort((a, b) => a.data[field] > b.data[field] ? (type === 'asc' ? 1 : -1) : (type === 'asc' ? -1 : 1));
    }
  }

  sortEvent(field: any) {
    if (field !== this.sortCond.field) {
      this.sortCond.type = 'asc';
    } else if (field === this.sortCond.field) {
      this.sortCond.type = this.sortCond.type === 'asc' ? 'desc' : 'asc';
    }
    this.sortCond.field = field;

    this.resultList$ = this.resultList$.pipe(
      map(result => {
        return this.sortOperation(result);
      })
    );
  }

}
