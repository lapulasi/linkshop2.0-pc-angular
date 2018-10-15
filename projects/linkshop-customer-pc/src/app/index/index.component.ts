import {Component, OnDestroy, OnInit} from '@angular/core';
import {IndexService} from './index-service';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: ['*{padding: 0; color: #fff}']
})
export class IndexComponent implements OnInit, OnDestroy {

  org = {code: '109', levelId: 1, geo: [114.057868, 22.543099], nextLevelId: 2, isShop: false};

  bubbleList$: Observable<any>;

  dataSum: any;
  dataByDate: any;
  ageAndGenderSum: any;
  ageAndGender: any;

  map: any;

  backButtonStatus = false;

  constructor(public index: IndexService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {

    this.route.parent.data.subscribe(data => {
      this.showBackButton();

      const orgResolve = data.org;
      this.org.levelId = orgResolve.levelId;
      this.org.code = orgResolve.orgCode;
      this.org.geo = orgResolve.geo;
      this.org.isShop = orgResolve.orgLevel.shop;

      this.loadStatData();
      this.index.nextLevel(orgResolve.levelId).pipe(
        map(level => {
          this.org.nextLevelId = level.id;
          this.loadBubble();
        })
      ).subscribe();

    });
  }

  ngOnDestroy() {
    this.map.destroy();
  }

  loadStatData() {
    this.index.loadGuestData(this.org.levelId, this.org.code, '').subscribe(data => {
      this.dataByDate = data;
    });
    this.index.loadGuestData(this.org.levelId, this.org.code, 'sum').subscribe(data => {
      this.dataSum = data;
    });
    // 累计
    this.index.loadAgeAndGenderData(this.org.code, 'sum').subscribe(data => {
      this.ageAndGenderSum = data;
      // console.log(this.ageAndGenderSum);
    });
    this.index.loadAgeAndGenderData(this.org.code, '').subscribe(data => {
      this.ageAndGender = data;
      // console.log(this.ageAndGender);
    });
  }

  // 加载气泡
  loadBubble() {
    this.bubbleList$ = this.index.loadMapData(this.org.nextLevelId, this.org.code);
  }

  // 切换数据类型
  switchDesType(num: any) {
    const index = this.index.getIndex(this.index.des.curr, this.index.des.list, num);
    this.index.des.curr = this.index.des.list[index + num];
  }

  // 切换日期
  switchDateType(num: any) {
    const index = this.index.getIndex(this.index.date.curr, this.index.date.list, num);
    this.index.date.curr = this.index.date.list[index + num];
    this.index.calDate();
    this.loadBubble();
    this.loadStatData();
  }

  onMapReady(event: any) {
    this.map = event;
  }

  onMarkerReady(event) {
    event.setFitView();
  }

  onMarkerClick(event: any) {
    if (!this.org.isShop) {
      const extData = event.target.F.extData;

      this.storageCode();

      this.router.navigate([`/${extData.orgCode}/index`]);
      this.map.setCenter(extData.geo);
    }
  }

  goBack() {
    if (localStorage.getItem('history')) {
      const arr = localStorage.getItem('history').split(',');
      const superCode = arr.pop();
      localStorage.setItem('history', arr.toString());
      this.router.navigate([`/${superCode}/index`]);
    }
  }

  storageCode() {
    const orgCode = this.org.code;
    if (localStorage.getItem('history')) {
      const arr = localStorage.getItem('history').split(',');
      arr.push(orgCode);
      localStorage.setItem('history', arr.toString());
    } else {
      localStorage.setItem('history', orgCode);
    }
  }

  showBackButton() {
    if (localStorage.getItem('history')) {
      this.backButtonStatus = true;
    } else {
      this.backButtonStatus = false;
    }

  }
}
