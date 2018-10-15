import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrgResolver} from './layout/org-resolver';
import {LayoutComponent} from './layout/layout.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: ':orgcode',
    component: LayoutComponent,
    resolve: {
      org: OrgResolver
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './index/index.module#IndexModule'
      },
      {
        path: 'stat',
        loadChildren: './data-stat/data-stat.module#DataStatModule'
      },
      {
        path: 'monitor',
        loadChildren: './monitor-view/monitor-view.module#MonitorViewModule'
      },
      {
        path: 'heatMap',
        loadChildren: './customer-pc-heat-map-view/customer-pc-heat-map-view.module#CustomerPcHeatMapViewModule'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
