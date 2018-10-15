import { DataStatModule } from './data-stat.module';

describe('DataStatModule', () => {
  let dataStatModule: DataStatModule;

  beforeEach(() => {
    dataStatModule = new DataStatModule();
  });

  it('should create an instance', () => {
    expect(dataStatModule).toBeTruthy();
  });
});
