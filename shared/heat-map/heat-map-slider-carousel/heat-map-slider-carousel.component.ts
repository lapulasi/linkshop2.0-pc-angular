import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {ShopGuestPos} from '../shop-guest-pos';
import * as $ from 'jquery';
import {HeatMapSliderCarouselItemComponent} from '../heat-map-slider-carousel-item/heat-map-slider-carousel-item.component';
import {Device} from '../../device';
import {ShopDevice} from '../../shop-device';

@Component({
  selector: 'app-heat-map-slider-carousel',
  template: `
    <div #container>
      <app-heat-map-slider-carousel-item #heatMapItemList
                                         *ngFor="let device of shopDeviceList;index as i"
                                         [isCurrentHeatMap]="i === currentHeatMapIndex"
                                         [device]="device"
                                         [shopGuestPosList]="allShopGuestPosListMap[device.deviceUID]"
                                         (extremaValuesNotifier)="notifyExtremaValues($event)"
      [width]="width" [height]="height">
      </app-heat-map-slider-carousel-item>
    </div>
  `,
  styleUrls: ['./heat-map-slider-carousel.component.scss']
})
export class HeatMapSliderCarouselComponent implements OnInit, OnChanges , AfterViewInit {

  @Input() shopDeviceList: Array<ShopDevice> = [];

  @Input() allShopGuestPosListMap: Map<string, ShopGuestPos> = new Map();

  @Input() opacity: number;

  @Input() valueThresholds: {min: number, max: number};

  @Input() width = '100%';

  @Input() height = '100%';

  @ViewChild('container') sliderCarouselContainer: ElementRef<HTMLDivElement>;

  @ViewChildren('heatMapItemList') heatMapItemList: QueryList<HeatMapSliderCarouselItemComponent>;

  @Output() extremaValuesChanged = new EventEmitter<{min: number, max: number}>();

  currentHeatMapIndex = 0;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const changedProp = changes[propName];
      if ( propName === 'allShopGuestPosListMap' && !changedProp.isFirstChange()) {
      }
      if (propName === 'valueThresholds' && !changedProp.isFirstChange()) {
        const currentSlide = $(this.sliderCarouselContainer.nativeElement).slick('slickCurrentSlide');
        this.heatMapItemList.toArray()[currentSlide].setValueThresholds(changedProp.currentValue);
      }
      if (propName === 'opacity' && !changedProp.isFirstChange()) {
        const currentSlide = $(this.sliderCarouselContainer.nativeElement).slick('slickCurrentSlide');
        this.heatMapItemList.toArray()[currentSlide].setOpacity(changedProp.currentValue);
      }
    }
  }


  ngAfterViewInit(): void {
    $(this.sliderCarouselContainer.nativeElement).slick({draggable: true});
    $(this.sliderCarouselContainer.nativeElement).on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      this.currentHeatMapIndex = nextSlide;
    });
    // this._emit(0);
  }

  notifyExtremaValues($event: {min: number, max: number}): void {
    this.extremaValuesChanged.emit($event);
  }

  // private _emit(index: number): void {
  //   const extremaValues = this.heatMapItemList.toArray()[index].getExtremaValues();
  //   this.extremaValuesChanged.emit(extremaValues);
  // }

}
