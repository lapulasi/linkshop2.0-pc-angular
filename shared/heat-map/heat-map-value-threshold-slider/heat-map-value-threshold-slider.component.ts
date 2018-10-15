import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as noUiSlider from 'nouislider';

@Component({
  selector: 'app-heat-map-value-threshold-slider',
  template: `
    <div style="margin-top: 20px">
      <span>值域</span>
      <div #element></div>
    </div>`,
  styleUrls: ['./heat-map-value-threshold-slider.component.css']
})
export class HeatMapValueThresholdSliderComponent implements OnInit, OnChanges {

  @ViewChild('element') divElementRef: ElementRef<HTMLDivElement>;

  @Input() extremaValues: {min: number, max: number};

  @Output() valueThresholdChanged: EventEmitter<{min: number, max: number}>
   = new EventEmitter<{min: number, max: number}>();

  constructor() { }

  ngOnInit() {
    const nativeElement = this.divElementRef.nativeElement;

    noUiSlider.create(nativeElement,
      <noUiSlider.Options>
        {
          start: [0, 1],
          step: 1,
          tooltips: [true, true],
          format: {
            to: function (value) {
              return Math.ceil(value);
            },
            from: function (value) {
              return Math.ceil(value);
            }
          },
          connect: true,
          range: {
            'min': [0],
            'max': [10]
          }
        });


    nativeElement['noUiSlider'].on('update', (values, handle) => {
        this.valueThresholdChanged.emit({min: values[0], max: values[1]});
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const changedProp = changes[propName];
      if (propName === 'extremaValues' || !changes[propName].isFirstChange()) {
          this._updateRange(changedProp.currentValue);
        }
    }
  }



  private _updateRange(extremaValues: {min: number, max: number}): void {
    if (this.divElementRef.nativeElement['noUiSlider']) {

      this.divElementRef.nativeElement['noUiSlider'].updateOptions({
        start: [extremaValues.min, extremaValues.max],
        range: {
          'min': extremaValues.min,
          'max': extremaValues.max
        }
      });

    }
  }

}
