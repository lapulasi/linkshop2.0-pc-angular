import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPcHeatMapViewRoutingModule } from './customer-pc-heat-map-view-routing.module';
import { CustomerPcHeatMapViewComponent } from './customer-pc-heat-map-view.component';
import {BsDatepickerModule, ModalModule, PaginationModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {HeatMapModule} from '../../../../../shared/heat-map/heat-map.module';
import {OrgTreeModule} from '../../../../../shared/org-tree/org-tree.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomerPcHeatMapViewRoutingModule,
    HeatMapModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    OrgTreeModule
  ],
  declarations: [CustomerPcHeatMapViewComponent]
})
export class CustomerPcHeatMapViewModule { }
