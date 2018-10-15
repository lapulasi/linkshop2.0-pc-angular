import {Component, OnInit} from '@angular/core';
import {MapService} from "./map";
import {DateService} from "./date";
import {ChartService} from "./chart";
import {DatePipe} from "@angular/common";
import {AdminHttpClient} from "../admin.httpclient";

@Component({
  selector: 'app-index-view',
  templateUrl: './index-view.component.html',
  styleUrls: ['./index-view.component.css'],
  providers: [DateService, ChartService, MapService]
})
export class IndexViewComponent implements OnInit {

  startDate = new Date();
  endDate = new Date();
  theme = 'count';

  // orgCode: any;
  org = {code: '109', name: '', geo: [116.397428, 39.90923], levelId: 0, adcode: '0'};
  nextLevel = {id: 3, name: '办事处'};

  constructor(
    public date: DateService,
    public chart: ChartService,
    public mapService: MapService,
    private http: AdminHttpClient) {}

  ngOnInit() {
    const nowStr = this.formatDate(this.date.now);
    const yesterStr = this.formatDate(new Date(this.date.now.getTime() - 1 * this.date.oneDayTime));

    this.http.get(`/org/bycode/${this.org.code}`, null).subscribe(data => {
      this.org.name = data.name;
      this.org.geo = data.geo;
      this.org.levelId = data.levelId;
      this.org.adcode = data.adcode;
      this.http.get(`/org/level/next/${this.org.levelId}`, null).subscribe(level => {
        this.nextLevel.id = level.id;
        this.nextLevel.name = level.name;

        this.mapService.loadMapData(this.nextLevel.id, this.org.code, nowStr, nowStr);
        this.mapService.dayView(this.org.levelId, this.org.code, nowStr, yesterStr);

        this.loadDataByDateChange();
      });
    });

  }

  // 切换日期类型
  switchDateType(count: any) {
    const len = this.date.dateType.list.length - 1;

    if (count < 0) {
      if (this.date.dateType.num > 0) {
        this.date.dateType.num--;
      } else {
        this.date.dateType.num = len;
      }
    } else if (count > 0) {
      if (this.date.dateType.num < len) {
        this.date.dateType.num++;
      } else {
        this.date.dateType.num = 0;
      }
    }
    this.date.dateType.curr = this.date.dateType.list[this.date.dateType.num];
    if (this.date.dateType.curr.val === 'week') {
      this.date.getWeekFistAndLastDay();
    }
    this.loadDataByDateChange();
  }

  // 切换日期
  switchDate(count: any) {
    if (count > 0 && this.date.currDate.getDate() >= this.date.now.getDate()) {
      return false;
    }

    const prevDate = this.date.currDate;
    this.date.currDate = new Date();
    switch (this.date.dateType.curr.val) {
      case 'day':
        this.date.currDate.setTime(prevDate.getTime() + count * this.date.oneDayTime);
        break;
      case 'week':
        this.date.currDate.setTime(prevDate.getTime() + count * 7 * this.date.oneDayTime);
        this.date.getWeekFistAndLastDay();
        break;
      case 'month':
        this.date.currDate.setMonth(prevDate.getMonth() + count);
    }
    this.loadDataByDateChange();
  }

  // 加载数据
  loadDataByDateChange() {
    switch (this.date.dateType.curr.val) {
      case 'day':
        this.startDate = new Date(this.date.currDate.getTime() - 6 * this.date.oneDayTime);
        this.endDate = this.date.currDate;
        break;
      case 'week':
        // const weekStart = this.date.weekStart;
        this.startDate = new Date(this.date.weekStart.getTime() - 5 * 7 * this.date.oneDayTime);
        this.endDate = this.date.weekEnd;
        break;
      case 'month':
        let year = this.date.currDate.getFullYear();
        let month = this.date.currDate.getMonth() - 6;
        if (this.date.currDate.getMonth() < 6) {
          year = year - 1;
          month = this.date.currDate.getMonth() + 6;
        }
        this.startDate = new Date(year, month, 1);
        this.endDate = new Date(this.date.currDate.getFullYear(), this.date.currDate.getMonth() + 1, 1);
    }

    const startDateStr = this.formatDate(this.startDate);
    const endDateStr = this.formatDate(this.endDate);

    // 客流、驻留
    this.chart.countAndStay(this.date.dateType.curr.val, this.org.code, startDateStr, endDateStr);
    // 年龄段
    this.chart.agePeriod(this.org.code, startDateStr, endDateStr);

    // 加载门店主题数据
    this.loadThemeData();
  }

  // 门店主题切换
  changeTheme() {
    if (this.theme === 'count') {
      this.theme = 'stay';
    } else {
      this.theme = 'count';
    }
    this.loadThemeData();
  }

  // 门店主题数据
  loadThemeData() {
    const startDateStr = this.formatDate(this.startDate);
    const endDateStr = this.formatDate(this.endDate);
    if (this.theme === 'count') {
      // 客流时段、趋势
      this.chart.countByHour(this.org.code, startDateStr, endDateStr);
    } else {

      // 驻留时段、趋势
      this.chart.stayByHour(this.org.code, startDateStr, endDateStr);
    }

    this.rankTable();
  }

  // 组织排名
  rankTable() {
    const startDateStr = this.formatDate(this.startDate);
    const endDateStr = this.formatDate(this.endDate);

    this.mapService.rankTable(this.theme, this.nextLevel.id, this.org.code, startDateStr, endDateStr);
  }

  formatDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }


}
