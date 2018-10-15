import {Component, OnInit} from '@angular/core';
import {GuestStatService} from "./guest-stat-service";

@Component({
  selector: 'app-guest-stat',
  templateUrl: './guest-stat.component.html'
})
export class GuestStatComponent implements OnInit {

  cond = {};
  page = 'guest';

  constructor(public guestStatService: GuestStatService) { }

  ngOnInit() {
  }

  acceptEvent(event) {
    if (event.org) {
      this.cond = event;
      this.guestStatService.loadChart(this.cond);
    }

  }

}
