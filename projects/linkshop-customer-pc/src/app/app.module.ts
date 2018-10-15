import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {NoopInterceptor} from "./noop-interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {WebHttpClient} from "./web.httpclient";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { LayoutComponent } from './layout/layout.component';
import {OrgResolver} from "./layout/org-resolver";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    WebHttpClient,
    OrgResolver,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
