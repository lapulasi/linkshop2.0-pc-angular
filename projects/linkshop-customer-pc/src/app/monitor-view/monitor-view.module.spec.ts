import { MonitorViewModule } from './monitor-view.module';

describe('MonitorViewModule', () => {
  let monitorViewModule: MonitorViewModule;

  beforeEach(() => {
    monitorViewModule = new MonitorViewModule();
  });

  it('should create an instance', () => {
    expect(monitorViewModule).toBeTruthy();
  });
});
