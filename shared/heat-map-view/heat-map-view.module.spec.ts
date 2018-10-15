import { HeatMapViewModule } from './heat-map-view.module';

describe('HeatMapViewModule', () => {
  let heatMapViewModule: HeatMapViewModule;

  beforeEach(() => {
    heatMapViewModule = new HeatMapViewModule();
  });

  it('should create an instance', () => {
    expect(heatMapViewModule).toBeTruthy();
  });
});
