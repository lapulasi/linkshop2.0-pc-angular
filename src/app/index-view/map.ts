import {Injectable} from "@angular/core";
import {IndexViewModule} from "./index-view.module";
import {AdminHttpClient} from "../admin.httpclient";
import {filter, map} from "rxjs/internal/operators";
import {AMapClass, AmapDistrictSearchService} from "ngx-amap";

declare const AMap: AMapClass;

@Injectable({providedIn: IndexViewModule})
export class MapService {

  rank = {list: [], sum: 0};
  markerData = {list: [], sumCount: 0, type: 'num'};
  map: any;
  dayViewData = {
    count: {val: 0, rate: 0, rank: 0},
    stay: {val: 0, rate: 0, rank: 0},
    age: {val: 0, list: [], sumList: 0},
    gender: {mcount: 0, fcount: 0, list: [], sumVal: 0, sumList: 0}
  };

  constructor(private http: AdminHttpClient, private amapDistrictSearch: AmapDistrictSearchService) {}

  // 地图数据
  loadMapData(levelId: any, orgCode: any, startDate: any, endDate: any) {
    this.http.get(`/org/datas`, {levelId: levelId, orgCode: orgCode, startDate: startDate, endDate: endDate})
      .pipe(
        map(result => {
          this.markerData.list = result;
          this.markerData.sumCount = result.reduce((pre, curr) => pre + curr.guestCount, 0);
          return result;
        })
      )
      .subscribe(data => {
        // console.log('map', data);
      });
  }

  async onMapReady(event: any, adcode: any) {
    this.map = event;

    const wrapper = await this.amapDistrictSearch.of({
      subdistrict: 1,   // 返回下一级行政区
      extensions: 'all'
      // level: 'district'  // 查询行政级别为 市
    });

    const { status, result } = await wrapper.search(adcode);
    console.log('result:', result);

    if (typeof result === 'string') {
      return;
    }
    const bounds = result.districtList[0].boundaries;
    bounds.forEach(e => {
      return new AMap.Polygon({
        map: event,
        strokeWeight: 1,
        path: e,
        fillColor: 'rgba(50,130,190,0.5)', // rgba(238,184,184,0.5)
        strokeColor: '#3fdaff'
      });
    });

  }

  onMarkerReady(event: any) {
    event.setFitView();
    // console.log('marker ready', event);
  }

  // 组织排名
  rankTable(themeType: any, levelId: any, orgCode: any, startDate: any, endDate: any) {
    this.http.get(`/org/datas`, {levelId: levelId, orgCode: orgCode, startDate: startDate, endDate: endDate})
      .pipe(
        map(result => {
          let sum = 0;
          const list = [];
          if (themeType === 'count') {
            sum = result.reduce((pre, curr) => pre + curr.guestCount, 0);
            result.map(val => {
              list.push({name: val.name, val: val.guestCount});
            });
          } else {
            sum = result.reduce((pre, curr) => pre + curr.stayMin, 0);
            result.map(val => {
              list.push({name: val.name, val: val.stayMin});
            });
          }
          this.rank = {list: list, sum: sum};
          // console.log(this.rank);
          return result;
        })
      ).subscribe(data => {
      // console.log(data);
    });

  }

  // 今日概览
  dayView(levelId: any, orgCode: any, nowStr: any, yesterStr: any) {
    let superOrgCode = orgCode;
    if (orgCode.length > 3) {
      superOrgCode = orgCode.substring(0, orgCode.length - 3);
    }

    this.http.get(`/org/datas`, {levelId: levelId, orgCode: superOrgCode, startDate: nowStr, endDate: nowStr}).subscribe(data => {
      console.log(data); // guestCount stayMin
      const currOrg = data.filter(val => val.orgCode === orgCode)[0];
      const countRank = data.sort((a, b) => a.guestCount > b.guestCount ? -1 : 1).findIndex(val => val.orgCode === orgCode) + 1;
      const stayRank = data.sort((a, b) => a.stayMin > b.stayMin ? -1 : 1).findIndex(val => val.orgCode === orgCode) + 1;

      // 昨天的数据
      this.http.get(`/org/datas`, {levelId: levelId, orgCode: orgCode, startDate: yesterStr, endDate: yesterStr}).subscribe(result => {
        const ys = result[0];
        const countRate = Math.round((currOrg.guestCount - ys.guestCount) * 100 / ys.guestCount);
        const stayRate = Math.round((currOrg.stayMin - ys.stayMin) * 100 / ys.stayMin);

        this.dayViewData.count = {val: currOrg.guestCount, rate: countRate, rank: countRank};
        this.dayViewData.stay = {val: Math.round(currOrg.stayMin / currOrg.guestCount), rate: stayRate, rank: stayRank};
      });

    });

    this.http.get(`/org/access/history`, {orgCode: orgCode}).subscribe(data => {
      const mcount = data.gender.filter(val => val._id === 'M').map(val => val.count);
      const fcount = data.gender.filter(val => val._id === 'F').map(val => val.count);
      const sumAgeCount = data.ageHistory.reduce((pre, curr) => pre + curr.count, 0);
      const sumGender = data.gender.reduce((pre, curr) => pre + curr.count, 0);
      const sumGenderHistory = data.genderHistory.reduce((pre, curr) => pre + curr.count, 0);

      this.dayViewData.age = {val: data.avgAge, list: data.ageHistory, sumList: sumAgeCount};
      this.dayViewData.gender = {fcount: fcount, mcount: mcount, list: data.genderHistory, sumVal: sumGender, sumList: sumGenderHistory};
    });


  }

}
