import {DateTimeFormatter, LocalDate} from 'js-joda';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input, OnChanges,
  OnInit,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import * as $ from 'jquery';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {HeatMap} from './heat-map';
import 'slick-carousel';
import * as noUiSlider from 'nouislider';
import * as uuid from 'uuid/v4';
import {Title} from '@angular/platform-browser';
import {ShopGuestPos} from './shop-guest-pos';
import {Device} from '../device';
import {ShopDevice} from '../shop-device';

@Component({
  selector: 'app-heat-map',
  template: `
      <div class="row">
        <div class="col">
          <app-heat-map-slider-carousel *ngIf="shopDeviceList?.length > 0"
                                        [shopDeviceList]="shopDeviceList"
                                        [allShopGuestPosListMap]="allShopGuestPosListMap"
                                        [valueThresholds]="sliderValueThresholds"
                                        [opacity]="sliderOpacity"
                                        [width]="width" [height]="height"
                                        (extremaValuesChanged)="onExtremaValuesChanged($event)">
          </app-heat-map-slider-carousel>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <app-heat-map-value-threshold-slider
            [extremaValues]="extremaValues"
            (valueThresholdChanged)="onValueThresholdChanged($event)"
            *ngIf="showSlider">
          </app-heat-map-value-threshold-slider>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <app-heat-map-opacity-slider (opacityChanged)="onOpacityChanged($event)" *ngIf="showSlider">
          </app-heat-map-opacity-slider>
        </div>
      </div>
  `,
  styleUrls: ['./heat-map.component.css']
})
// TODO 后面再重构
export class HeatMapComponent implements OnInit, AfterViewInit, OnChanges {
  // 摄像头uid列表
  shopDeviceList: Array<ShopDevice>;

  allShopGuestPosListMap: Map<string, ShopGuestPos> = new Map();

  @Input() showSlider: true;

  // 热力图是按照“月”,“周”,“天”展示数据
  public type = 'day';

  @Input() org;

  @Input() shopId: number;

  @Input() dateRange: Array<string> = [];

  @Input() width = '100%';

  @Input() height = '100%';

  extremaValues: {min: number, max: number};

  sliderValueThresholds: {min: number, max: number};

  sliderOpacity: number;

  constructor(private http: HttpClient
              // , private title: Title
  ) {}

  ngOnInit() {
    // this.title.setTitle('热力图');
    this.http.get(`/device/list?shopId=${this.shopId}&type=VIEW`).subscribe((shopDeviceList: Array<ShopDevice>) => {
      this.shopDeviceList = shopDeviceList;
    });
  }

  ngAfterViewInit(): void {
    // TimerObservable.create(0, 6000)
    //   .subscribe().add(this.loadShopGuestPositionData(this.dateRange));
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const prop in changes) {
      if (prop === 'dateRange' ) {
        this.loadShopGuestPositionData(changes[prop].currentValue);
      }
    }
  }



  private loadShopGuestPositionData(dateRange: Array<string>): void {
    this.http.get(`/device/shop/${this.shopId}/guestPositions/v2`,
      {
        params: {
          beginDate: dateRange[0],
          endDate: dateRange[1],
          cellSize: '16'
        }
      })
      .subscribe((data: Map<string, ShopGuestPos>) => {
        this.allShopGuestPosListMap = data;
      });
  }

  onValueThresholdChanged($event: {min: number, max: number}): void {
    this.sliderValueThresholds = $event;
  }

  onOpacityChanged($event: number): void {
    this.sliderOpacity = $event;
  }

  onExtremaValuesChanged($event: {min: number, max: number}): void {
    this.extremaValues = $event;
  }


}
