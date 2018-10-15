import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStatRoutingModule } from './data-stat-routing.module';
import { GuestStatComponent } from './guest-stat/guest-stat.component';
import { SalesStatComponent } from './sales-stat/sales-stat.component';
import { DeviceStatComponent } from './device-stat/device-stat.component';
import { CondStatComponent } from './share-stat/cond-stat/cond-stat.component';
import { SubOrgStatComponent } from './share-stat/sub-org-stat/sub-org-stat.component';
import {GuestStatService} from "./guest-stat/guest-stat-service";
import { TrendAnalysisChartComponent } from './share-stat/trend-analysis-chart/trend-analysis-chart.component';
import {NgxEchartsModule} from "ngx-echarts";
import {ChartStat} from "./chart-stat";
import {SalesStatService} from "./sales-stat/sales-stat-service";
import {BsDatepickerModule, ModalModule} from "ngx-bootstrap";
import {OrgTreeModule} from "../../../../../shared/org-tree/org-tree.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    DataStatRoutingModule,
    NgxEchartsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    OrgTreeModule,
    FormsModule
  ],
  declarations: [GuestStatComponent, SalesStatComponent, DeviceStatComponent, CondStatComponent, SubOrgStatComponent, TrendAnalysisChartComponent],
  providers: [GuestStatService, SalesStatService, ChartStat]
})
export class DataStatModule { }
