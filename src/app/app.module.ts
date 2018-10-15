
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {HttpModule, JsonpModule} from '@angular/http';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {AppComponent} from './app.component';

// Import containers
import {DefaultLayoutComponent} from './containers';

import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import {AppRoutingModule} from './app.routing';

// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {FormsModule} from '@angular/forms';
import {LoginService} from './views/login/login.service';
import {AdminHttpClient} from './admin.httpclient';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BackendHostInterceptor} from './backendhost.interceptor';
import {HeatMapViewModule} from '../../shared/heat-map-view/heat-map-view.module';

@NgModule({
  imports: [
    HttpModule,
    JsonpModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy // HashLocationStrategy 有#号
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendHostInterceptor,
      multi: true,
    },
    LoginService,
    AdminHttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
