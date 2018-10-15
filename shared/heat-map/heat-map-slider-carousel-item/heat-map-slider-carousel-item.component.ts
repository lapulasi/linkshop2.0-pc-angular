import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ShopGuestPos} from '../shop-guest-pos';
import {HeatMap} from '../heat-map';
import {Observable, Subject} from 'rxjs';
import 'rxjs-compat/add/operator/concat';
import 'rxjs-compat/add/operator/take';
import {Device} from '../../device';
@Component({
  selector: 'app-heat-map-slider-carousel-item',
  template: `
    <div #heatMapContainer class="heat-map-slide">
      <img src="{{heatMapBg(device)}}" [style.width]="width" [style.height]="height" style="margin: 0px"
      (load)="createHeatMap()">
    </div>
  `,
  styleUrls: ['./heat-map-slider-carousel-item.component.scss']
})
export class HeatMapSliderCarouselItemComponent implements OnInit , OnChanges, AfterViewInit {


  @Input() device: Device;

  @Input() shopGuestPosList: Array<ShopGuestPos>;

  @ViewChild('heatMapContainer') heatMapElementRef: ElementRef<HTMLDivElement>;

  @Input() width = '100%';

  @Input() height = '100%';

  @Input() valueThresholds: {min: number, max: number};

  @Input() isCurrentHeatMap: boolean;

  @Output() extremaValuesNotifier = new EventEmitter<{min: number, max: number}>();

  private heatMap: HeatMap;

  private imageLoadObservable = new Subject();

  private shopGuestPosListObservable = new Subject();

  constructor() { }

  ngOnInit() {
    //  确保图片加载完成后在创建热力图
    this.imageLoadObservable.subscribe(() => {
      this.heatMap = new HeatMap('day', this.heatMapElementRef.nativeElement,  []);
      console.log('new heatMap.......');
      this.shopGuestPosListObservable.subscribe((value: Array<ShopGuestPos>) => {
        console.log('set data ....');
        this.heatMap.setData(value || []);
        if (this.isCurrentHeatMap) {
          this.extremaValuesNotifier.emit(this.heatMap.getExtremaValues());
        }
      });
    });

  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {

    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (propName === 'shopGuestPosList') {
        this.shopGuestPosListObservable.next(changedProp.currentValue);
      }
      if (propName === 'isCurrentHeatMap' && changedProp.currentValue === true) {
        if (this.heatMap) {
          this.extremaValuesNotifier.emit(this.heatMap.getExtremaValues());
        }
      }
    }
  }

  ngAfterViewInit(): void {
  }

  createHeatMap(): void {
    this.imageLoadObservable.next();
  }

  setValueThresholds(valueThresholds: {min: number, max: number}): void {
    if (this.heatMap) {
      console.log('setValueThresholds:', valueThresholds.min, valueThresholds.max);
      this.heatMap.setRenderThreshold(valueThresholds.min, valueThresholds.max);
    }
  }

  setOpacity(opacity: number): void {
    if (this.heatMap) {
      this.heatMap.setOpacity(opacity);
    }
  }

  heatMapBg(device) {
    // return 'http://avc-test.oss-cn-shenzhen.aliyuncs.com/origin/view/H7BPAGVK4V9ZFDTC111A/20180730/114051Bzr.jpg';
    let heatMapBg = '';
    if (device['heatmap_background']) {
      heatMapBg = 'http://avc-test.oss-cn-shenzhen.aliyuncs.com/' + device['heatmap_background'];
    } else {
      heatMapBg = 'assets/img/mine_banner.png';
    }
    return heatMapBg;

  }

}
