import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-stat',
  templateUrl: './device-stat.component.html'
})
export class DeviceStatComponent implements OnInit {

  cond = {};
  page = 'device';

  constructor() { }

  ngOnInit() {
  }

  acceptEvent(event) {
    if (event.org) {
      this.cond = event;
    }
  }

}
