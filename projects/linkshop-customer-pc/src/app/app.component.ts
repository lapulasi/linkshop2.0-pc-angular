import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {filter, map} from "rxjs/internal/operators";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title) {}

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    ).subscribe((event) => {
      if (event.snapshot.data['title']) {
        this.title.setTitle(event.snapshot.data['title']);
      }
    });

  }

}
