import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapValueThresholdSliderComponent } from './heat-map-value-threshold-slider.component';

describe('HeatMapValueThresholdSliderComponent', () => {
  let component: HeatMapValueThresholdSliderComponent;
  let fixture: ComponentFixture<HeatMapValueThresholdSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapValueThresholdSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapValueThresholdSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
