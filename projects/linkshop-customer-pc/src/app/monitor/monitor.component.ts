import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Result} from '../../../../../shared/result';
import 'rxjs-compat/add/operator/mergeMap';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-monitor',
  template: `
    <video [id]="deviceUID"  controls playsInline webkit-playsinline *ngIf="vedioAddress">
      <source [src]="vedioAddress" type="application/x-mpegURL" />
    </video>
  `,
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() deviceUID;

  private player: any;

  vedioAddress: string;

  constructor(private http: HttpClient, private ref: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.vedioAddress = '';
    //     (<HTMLVideoElement>document.getElementById(this.deviceUID)).src = '';
    //     this.ref.detectChanges();
    //     console.log('NavigationStart');
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const changedProp = changes[propName];
      if (propName === 'deviceUID') {
        this.http.get(`/device/ys/${this.deviceUID}/vedio`).subscribe((result: Result) => {
          if (result.resultCode === 'SUCCESS') {
            this.vedioAddress = result.resultData;
            if (this.vedioAddress) {
              this.ref.detectChanges();
              this.player = new window['EZUIPlayer'](this.deviceUID);
              this.player.play();

            }

          }

        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.pause();

    }
  }



}
