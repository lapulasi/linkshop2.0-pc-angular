import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ParamMap} from '@angular/router/src/shared';

@Component({
  selector: 'app-heat-map-single-view',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <app-heat-map [shopId]="shopId" [showSlider]="true" [dateRange]="dateStringRange"></app-heat-map>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./heat-map-single-view.component.scss']
})
export class HeatMapSingleViewComponent implements OnInit {

  shopId: number;

  dateStringRange = ['2018-08-15', '2018-08-15'];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
        this.shopId = parseInt(paramMap.get('shopId'), 0);
    });
  }

}
