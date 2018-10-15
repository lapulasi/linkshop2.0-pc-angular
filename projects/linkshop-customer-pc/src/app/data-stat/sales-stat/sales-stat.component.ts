import { Component, OnInit } from '@angular/core';
import {SalesStatService} from "./sales-stat-service";

@Component({
  selector: 'app-sales-stat',
  templateUrl: './sales-stat.component.html'
})
export class SalesStatComponent implements OnInit {

  cond = {};
  page = 'sales';

  constructor(public salesStatService: SalesStatService) { }

  ngOnInit() {
  }

  acceptEvent(event) {
    if (event.org) {
      this.cond = event;
      this.salesStatService.loadChart(this.cond);
    }
  }

}
