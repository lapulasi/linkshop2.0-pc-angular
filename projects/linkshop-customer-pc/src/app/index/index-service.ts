import {Injectable} from '@angular/core';
import {WebHttpClient} from '../web.httpclient';
import {map} from 'rxjs/internal/operators';
import {DatePipe} from '@angular/common';

@Injectable()
export class IndexService {

  date = {
    oneDayTime: 24 * 60 * 60 * 1000,
    start: new Date(),
    end: new Date(),
    curr: {val: 'day', name: '实时'},
    list: [{val: 'day', name: '实时'}, {val: 'week', name: '本周'}, {val: 'month', name: '本月'}]
  };

  des = {
    curr: {val: 'count', name: '客流'},
    list: [{val: 'count', name: '客流'}, {val: 'avgStay', name: '驻留'}, {val: 'jkl', name: '集客力'}, {val: 'px', name: '坪效'}]
  };

  constructor(private http: WebHttpClient) {}

  // 地图数据
  loadMapData(levelId: any, orgCode: any) {
    const startDateStr = this.formatDate(this.date.start);
    const endDateStr = this.formatDate(this.date.end);

    return this.http.get(`/org/regional/shop`,
      {levelId: levelId, orgCode: orgCode, adcode: '', startDate: startDateStr, endDate: endDateStr}).pipe(
      map(result => {
        const list = [];
        result.forEach(item => {
          const count = item.data.guestCount;
          const shopArea = item.data.allShopArea;
          list.push({
            name: item.name,
            orgCode: item.orgCode,
            geo: item.geo,
            count: count,
            avgStay: count === 0 ? 0 : (item.data.guestStayTime / count).toFixed(2),
            jkl: shopArea === 0 ? 0 : (count / shopArea).toFixed(2),
            px: shopArea === 0 ? 0 : (item.data.allAmount / shopArea).toFixed(2)
          });
        });
        return list;
      })
    );
  }

  nextLevel(levelId: any) {
    return this.http.get(`/org/level/next/${levelId}`, null);
  }

  loadGuestData(levelId: any, orgCode: any, type: any) {
    const startDateStr = this.formatDate(this.date.start);
    const endDateStr = this.formatDate(this.date.end);

    let param = {};
    if ( type !== 'sum') {
      param = {levelId: levelId, orgCode: orgCode, adcode: '', startDate: startDateStr, endDate: endDateStr};
    } else {
      param = {levelId: levelId, orgCode: orgCode, adcode: ''};
    }

    return this.http.get(`/org/regional/shop`, param).pipe(
      map(result => {
        // console.log(result);

        const item = result[0];
        const count = item.data.guestCount;
        const shopArea = item.data.allShopArea;
        return {
          count: count,
          avgStay: count === 0 ? 0 : (item.data.guestStayTime / count).toFixed(2),
          jkl: shopArea === 0 ? 0 : (count / shopArea).toFixed(2),
          px: shopArea === 0 ? 0 : (item.data.allAmount / shopArea).toFixed(2),
          amount: item.data.allAmount,
          volume: item.data.allVolume
        };
      })
    );
  }

  loadAgeAndGenderData(orgCode: any, type: any) {
    const startDateStr = this.formatDate(this.date.start);
    const endDateStr = this.formatDate(this.date.end);

    let param = {};
    if ( type !== 'sum') {
      param = {orgCode: orgCode, startDate: startDateStr, endDate: endDateStr};
    } else {
      param = {orgCode: orgCode};
    }
    return this.http.get(`/org/access/ageAndGender`, param).pipe(
      map(result => {
        // console.log(result);
        const sumCount = result.genderList.reduce((pre, curr) => pre + curr.count, 0);
        const ageList = result.ageList.sort((a, b) => a.count > b.count ? -1 : 1).slice(0, 3);
        const crCount = ageList.reduce((pre, curr) => pre + curr.count, 0);
        const f = result.genderList.filter(val => val._id === 'F');
        const m = result.genderList.filter(val => val._id === 'M');
        // console.log(f);
        return {
          avgAge: result.avgAge,
          sumCount: sumCount,
          mCount: m !== null && m.length > 0 ? m[0]['count'] : 0,
          fCount: f !== null && f.length > 0 ? f[0]['count'] : 0,
          topList: ageList,
          crCount: crCount
        };

      })
    );
  }

  // 计算日期
  calDate() {
    this.date.start = new Date();
    if (this.date.curr.val === 'week') {
      this.date.start.setTime(new Date().getTime() - (new Date().getDay() - 1) * this.date.oneDayTime);
    } else if (this.date.curr.val === 'month') {
      this.date.start.setDate(1);
    }
  }

  getIndex(currItem: any, list: any, num: any) {
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (currItem.val === item.val) {
        index = i;
      }
    }

    if (num < 0 && index === 0) {
      index = list.length;
    } else if (num > 0 && index === list.length - 1) {
      index = -1;
    }

    return index;
  }

  formatDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }


}
