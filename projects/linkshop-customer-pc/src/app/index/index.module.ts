import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import {NgxAmapModule} from "ngx-amap";
import {IndexService} from "./index-service";

@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    NgxAmapModule.forRoot({apiKey: '5030d7d895261335864db46a23d88cb5'}),
  ],
  declarations: [IndexComponent],
  providers: [IndexService, DatePipe]
})
export class IndexModule { }
