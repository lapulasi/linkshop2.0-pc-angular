import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerPcHeatMapViewComponent} from './customer-pc-heat-map-view.component';

const routes: Routes = [{
  path: '',
  component: CustomerPcHeatMapViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPcHeatMapViewRoutingModule { }
