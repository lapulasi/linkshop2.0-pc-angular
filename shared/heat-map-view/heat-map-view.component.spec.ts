import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapViewComponent } from './heat-map-view.component';

describe('HeatMapViewComponent', () => {
  let component: HeatMapViewComponent;
  let fixture: ComponentFixture<HeatMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
