import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndexComponent} from "./index.component";
import {OrgResolver} from "../layout/org-resolver";

const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent,
    data: {title: '首页'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
