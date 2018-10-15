import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeatMapComponent} from './heat-map.component';
import {FormsModule} from '@angular/forms';
import { HeatMapValueThresholdSliderComponent } from './heat-map-value-threshold-slider/heat-map-value-threshold-slider.component';
import { HeatMapOpacitySliderComponent } from './heat-map-opacity-slider/heat-map-opacity-slider.component';
import { HeatMapSliderCarouselComponent } from './heat-map-slider-carousel/heat-map-slider-carousel.component';
import { HeatMapSliderCarouselItemComponent } from './heat-map-slider-carousel-item/heat-map-slider-carousel-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [HeatMapComponent,
    HeatMapValueThresholdSliderComponent,
    HeatMapOpacitySliderComponent,
    HeatMapSliderCarouselComponent,
    HeatMapSliderCarouselItemComponent],
  exports: [HeatMapComponent]
})
export class HeatMapModule { }
