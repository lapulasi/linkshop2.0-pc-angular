import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPcHeatMapViewComponent } from './customer-pc-heat-map-view.component';

describe('CustomerPcHeatMapViewComponent', () => {
  let component: CustomerPcHeatMapViewComponent;
  let fixture: ComponentFixture<CustomerPcHeatMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPcHeatMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPcHeatMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
