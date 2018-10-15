import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MonitorViewComponent} from './monitor-view.component';

const routes: Routes = [{
  path: '',
  component: MonitorViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorViewRoutingModule { }
