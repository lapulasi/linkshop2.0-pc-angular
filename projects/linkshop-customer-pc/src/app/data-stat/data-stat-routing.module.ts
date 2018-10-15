import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GuestStatComponent} from "./guest-stat/guest-stat.component";
import {SalesStatComponent} from "./sales-stat/sales-stat.component";
import {DeviceStatComponent} from "./device-stat/device-stat.component";

const routes: Routes = [
  {
    path: 'guest',
    component: GuestStatComponent,
    data: {title: '数据分析-客流'}
  },
  {
    path: 'sales',
    component: SalesStatComponent,
    data: {title: '数据分析-销售'}
  },
  {
    path: 'device',
    component: DeviceStatComponent,
    data: {title: '数据分析-设备'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataStatRoutingModule { }
