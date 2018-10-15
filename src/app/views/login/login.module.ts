import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login.routing';

import {LoginComponent} from './login.component';

import { LoginService } from './login.service';
import {AdminHttpClient} from '../../admin.httpclient';


@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  declarations: [
    // LoginComponent
  ],
  providers: [
    LoginService,
    AdminHttpClient
  ]
})
export class LoginModule { }
