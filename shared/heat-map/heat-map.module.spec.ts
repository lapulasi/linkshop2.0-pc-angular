import { HeatMapModule } from './heat-map.module';

describe('HeatMapModule', () => {
  let heatMapModule: HeatMapModule;

  beforeEach(() => {
    heatMapModule = new HeatMapModule();
  });

  it('should create an instance', () => {
    expect(heatMapModule).toBeTruthy();
  });
});
