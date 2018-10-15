import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapSliderCarouselComponent } from './heat-map-slider-carousel.component';

describe('HeatMapSliderCarouselComponent', () => {
  let component: HeatMapSliderCarouselComponent;
  let fixture: ComponentFixture<HeatMapSliderCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapSliderCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapSliderCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
