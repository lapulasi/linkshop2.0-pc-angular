import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapSingleViewComponent } from './heat-map-single-view.component';

describe('HeatMapSingleViewComponent', () => {
  let component: HeatMapSingleViewComponent;
  let fixture: ComponentFixture<HeatMapSingleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapSingleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
