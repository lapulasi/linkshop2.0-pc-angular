import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapOpacitySliderComponent } from './heat-map-opacity-slider.component';

describe('HeatMapOpacitySliderComponent', () => {
  let component: HeatMapOpacitySliderComponent;
  let fixture: ComponentFixture<HeatMapOpacitySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapOpacitySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapOpacitySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
