import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexViewComponent} from "./index-view.component";

const routes: Routes = [
  {path: 'index', component: IndexViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexViewRoutingModule { }
