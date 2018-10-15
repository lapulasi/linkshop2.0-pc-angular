import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorViewRoutingModule } from './monitor-view-routing.module';
import { MonitorViewComponent } from './monitor-view.component';
import {FormsModule} from '@angular/forms';
import {OrgTreeModule} from '../../../../../shared/org-tree/org-tree.module';
import {ModalModule} from 'ngx-bootstrap';
import {MonitorModule} from '../monitor/monitor.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MonitorViewRoutingModule,
    OrgTreeModule,
    ModalModule.forRoot(),
    MonitorModule
  ],
  declarations: [MonitorViewComponent],
  schemas: [
    NO_ERRORS_SCHEMA /*如果该模块有用到外部组件的时候要加上*/
  ]
})
export class MonitorViewModule { }
