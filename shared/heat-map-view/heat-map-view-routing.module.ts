import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeatMapViewComponent} from './heat-map-view.component';
import {HeatMapSingleViewComponent} from './heat-map-single-view/heat-map-single-view.component';

const routes: Routes = [
  {
    path: '',
    component: HeatMapViewComponent
  },
  {
    path: ':shopId',
    component: HeatMapSingleViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeatMapViewRoutingModule { }
