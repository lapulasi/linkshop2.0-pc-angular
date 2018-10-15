import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor-routing.module';
import {MonitorComponent} from './monitor.component';

@NgModule({
  imports: [
    CommonModule,
    // MonitorRoutingModule
  ],
  declarations: [MonitorComponent],
  exports: [MonitorComponent]
})
export class MonitorModule { }
