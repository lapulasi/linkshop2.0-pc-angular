import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {map} from "rxjs/internal/operators";
import {ActivatedRoute} from "@angular/router";
import {WebHttpClient} from "../../../web.httpclient";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-cond-stat',
  templateUrl: './cond-stat.component.html'
})
export class CondStatComponent implements OnInit {
  org = {code: '109', id: 1, shopLevelId: 5}; //, nextLevelId: 2
  date = {start: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), end: new Date()};
  @Output() event: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private http: WebHttpClient) {
  }

  getTime(date) {
    let timeObj = {};
    const fullYear = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    timeObj = {
      year: fullYear,
      month: month,
      day: day
    }
    console.log(timeObj);
    return timeObj;
  }

  ngOnInit() {
    // this.eventEmit();

      console.log(this.date.start);
    this.route.parent.parent.data.subscribe(data => {
      this.org.code = data.org.orgCode;
      this.org.id = data.org.id;

      this.loadData(data.org.levelId);

    });
  }

  loadData(levelId) {
    this.http.get(`/org/level/shop/${this.org.code}`).subscribe(data => {
      this.org.shopLevelId = data.id;
      this.eventEmit();
    });

    // this.http.get(`/org/level/next/${levelId}`, null).pipe(
    //   map(level => {
    //     this.org.nextLevelId = level.id;
    //
    //   })
    // ).subscribe();
  }

  startDateChange(event) {
    if (this.date.start !== event) {
      this.date.start = event;
      this.eventEmit();
    }
  }

  endDateChange(event) {
    if (this.date.end !== event) {
      this.date.end = event;
      this.eventEmit();
    }
  }

  eventEmit() {
    this.event.emit({
      org: this.org,
      date: {start: this.formatDate(this.date.start), end: this.formatDate(this.date.end)}
    });
  }

  formatDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }


  selectOrg(staticModal) {
    staticModal.show();
  }

  getOrgInfo(event, staticModal) {
    staticModal.hide();
    this.org.code = event.orgCode;
    this.org.id = event._id;
    this.loadData(event.levelId);
    // console.log(event);
  }
}
