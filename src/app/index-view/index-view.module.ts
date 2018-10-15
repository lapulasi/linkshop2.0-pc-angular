import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { IndexViewRoutingModule } from './index-view-routing.module';
import { IndexViewComponent } from './index-view.component';
import {NgxAmapModule} from "ngx-amap";
import {NgxEchartsModule} from "ngx-echarts";

@NgModule({
  imports: [
    CommonModule,
    IndexViewRoutingModule,
    NgxAmapModule.forRoot({apiKey: '5030d7d895261335864db46a23d88cb5'}),
    NgxEchartsModule
  ],
  declarations: [IndexViewComponent]
})
export class IndexViewModule { }
