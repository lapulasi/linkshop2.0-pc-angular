import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../login/login-service";

declare var screenfull: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: ['*{padding: 0; color: #fff}']
})
export class LayoutComponent implements OnInit {

  org: any;
  indexActive: boolean;
  name: any;
  screenFullStatus = false;

  constructor(private route: ActivatedRoute, private router: Router, private user: LoginService) { }

  ngOnInit() {
    this.screenFullStatus = screenfull.isFullscreen;
    this.name = this.user.getUser().name;

    this.route.data.subscribe(data => {
      this.org = data.org;
      this.isIndexActive();
    });

    this.router.events.subscribe((event) => {
      this.isIndexActive();
    });
  }

  isIndexActive() {
    const url = this.router.routerState.snapshot.url;
    if (url.indexOf('index') > 0) {
      this.indexActive = true;
    } else {
      this.indexActive = false;
    }
  }

  loginOut() {
    this.user.loginOut();
    this.router.navigate(['/login']);

  }

  screenFull() {
    if (screenfull.enabled) {
      screenfull.toggle();
      this.screenFullStatus = !screenfull.isFullscreen;
      console.log(this.screenFullStatus);
    }

  }
}
