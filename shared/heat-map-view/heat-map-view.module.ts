import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeatMapViewRoutingModule } from './heat-map-view-routing.module';
import {HeatMapModule} from '../heat-map/heat-map.module';
import {HeatMapViewComponent} from './heat-map-view.component';
import {FormsModule} from '@angular/forms';
import {BsDatepickerModule, ModalModule, PaginationModule} from 'ngx-bootstrap';
import { HeatMapSingleViewComponent } from './heat-map-single-view/heat-map-single-view.component';
import {OrgTreeModule} from '../org-tree/org-tree.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeatMapViewRoutingModule,
    HeatMapModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    OrgTreeModule
  ],
  declarations: [HeatMapViewComponent, HeatMapSingleViewComponent],
  schemas: [
    NO_ERRORS_SCHEMA /*如果该模块有用到外部组件的时候要加上*/
  ]

})
export class HeatMapViewModule { }
