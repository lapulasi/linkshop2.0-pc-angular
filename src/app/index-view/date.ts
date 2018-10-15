import {ChangeDetectorRef, Injectable} from "@angular/core";
import {IndexViewModule} from "./index-view.module";

@Injectable({providedIn: IndexViewModule})
export class DateService {

  dateType = {curr: {val: 'day', des: '按天', unit: '日'}, num: 0,
    list: [{val: 'day', des: '按天', unit: '日'}, {val: 'week', des: '按周', unit: '周'}, {val: 'month', des: '按月', unit: '月'}]};

  oneDayTime = 24 * 60 * 60 * 1000;
  now = new Date();
  currDate = this.now;

  weekStart = new Date();
  weekEnd = new Date();

  constructor(private ref: ChangeDetectorRef) {}

  // 切换日期类型
  switchDateType(count: any) {
    const len = this.dateType.list.length - 1;

    if (count < 0) {
      if (this.dateType.num > 0) {
        this.dateType.num--;
      } else {
        this.dateType.num = len;
      }
    } else if (count > 0) {
      if (this.dateType.num < len) {
        this.dateType.num++;
      } else {
        this.dateType.num = 0;
      }
    }
    this.dateType.curr = this.dateType.list[this.dateType.num];
    if (this.dateType.curr.val === 'week') {
      this.getWeekFistAndLastDay();
    }
  }

  // 切换日期
  switchDate(count: any) {
    if (count > 0 && this.currDate.getDate() >= this.now.getDate()) {
      return false;
    }

    const prevDate = this.currDate;
    this.currDate = new Date(prevDate.getTime());
    if (this.dateType.curr.val === 'day') {
      this.currDate.setTime(prevDate.getTime() + count * this.oneDayTime);
    } else if (this.dateType.curr.val === 'week') {
      this.currDate.setTime(prevDate.getTime() + count * 7 * this.oneDayTime);
      this.getWeekFistAndLastDay();
    } else {
      // console.log(prevDate.getMonth());
      this.currDate.setMonth(prevDate.getMonth() + count);
    }
  }

  // 获取周一和周日的日期
  getWeekFistAndLastDay() {
    this.weekStart = new Date();
    this.weekEnd = new Date();

    if (this.currDate.getFullYear() === this.now.getFullYear() && this.getWeek(this.currDate) === this.getWeek(this.now)) {
      this.weekStart.setTime(this.currDate.getTime() - (this.currDate.getDay() - 1) * this.oneDayTime);
    } else {
      this.weekStart.setTime(this.currDate.getTime() - (this.currDate.getDay() - 1) * this.oneDayTime);
      this.weekEnd.setTime(this.currDate.getTime() + (7 - this.currDate.getDay()) * this.oneDayTime);
    }

  }

  // 根据日期获取一年内的第几周
  getWeek(date: any) {

    const firstDay = new Date(date.getFullYear(), 0 , 1); // 本年的第一天,Js月份从0开始记！0就是1月啦。
    let dayWeek = date.getDay(); // 今天周几
    if (dayWeek === 0) {
      dayWeek = 7;
    }
    let startWeek = firstDay.getDay(); // 本年第一天周几
    if (startWeek === 0) {
      startWeek = 7;
    }
    return Math.floor(((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000) + startWeek - dayWeek ) / 7) + 1;
  }



}
