import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapSliderCarouselItemComponent } from './heat-map-slider-carousel-item.component';

describe('HeatMapSliderCarouselItemComponent', () => {
  let component: HeatMapSliderCarouselItemComponent;
  let fixture: ComponentFixture<HeatMapSliderCarouselItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapSliderCarouselItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapSliderCarouselItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
