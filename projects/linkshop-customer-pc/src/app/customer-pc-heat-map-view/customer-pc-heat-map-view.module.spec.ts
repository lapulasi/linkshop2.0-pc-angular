import { CustomerPcHeatMapViewModule } from './customer-pc-heat-map-view.module';

describe('CustomerPcHeatMapViewModule', () => {
  let customerPcHeatMapViewModule: CustomerPcHeatMapViewModule;

  beforeEach(() => {
    customerPcHeatMapViewModule = new CustomerPcHeatMapViewModule();
  });

  it('should create an instance', () => {
    expect(customerPcHeatMapViewModule).toBeTruthy();
  });
});
