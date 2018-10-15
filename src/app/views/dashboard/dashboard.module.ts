import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {ModalModule, BsDatepickerModule} from 'ngx-bootstrap';

import {CommonModule, DatePipe} from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardService} from './dashboard.service';
import {OrgTreeModule} from '../../../../shared/org-tree/org-tree.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    OrgTreeModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  declarations: [ DashboardComponent ],
  providers: [
    DashboardService,
    DatePipe
  ],
  schemas: [
    NO_ERRORS_SCHEMA /*如果该模块有用到外部组件的时候要加上*/
  ]
})
export class DashboardModule { }
