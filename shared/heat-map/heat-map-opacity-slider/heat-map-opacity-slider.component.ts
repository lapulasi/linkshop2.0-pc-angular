import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as noUiSlider from 'nouislider';

@Component({
  selector: 'app-heat-map-opacity-slider',
  template: `
    <div style="margin-top: 20px">
      <span>透明度</span>
      <div #element>
      </div>
    </div>
  `,
  styleUrls: ['./heat-map-opacity-slider.component.css']
})
export class HeatMapOpacitySliderComponent implements OnInit {

  @ViewChild('element') divElementRef: ElementRef<HTMLDivElement>;

  @Output() opacityChanged: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    const nativeElement = this.divElementRef.nativeElement;

    noUiSlider.create(nativeElement,
      <noUiSlider.Options>
        {
          start: 0.8,
          step: 0.1,
          tooltips: [true],
          connect: [true, false],
          range: {
            'min': [0.2],
            'max': [1]
          }
        });
    nativeElement['noUiSlider'].on('update', (values, handle) => {
        this.opacityChanged.emit(values[0]);
    });

  }

}
