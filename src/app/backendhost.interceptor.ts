import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';
import 'rxjs-compat/add/observable/of';
import 'rxjs-compat/add/operator/catch';

@Injectable()
export class BackendHostInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url: string = req.url;

    if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
      req = req.clone({
        url: environment.service_url + req.url
        // setHeaders: this.setAuthorization(),
        // setParams: this.setToken()
      });
    }
    // return next.handle(req).catch(err => this.handleError(err));
    return next.handle(req);
  }

  // handle 401
  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 0) {

      alert('token过期，请重新登录');
      this.router.navigate(['/login']);

      return Observable.of(err.message);
    }
    return Observable.throw(err);
  }

  setAuthorization() {
    if (localStorage.getItem('token_obj')) {
      const tokenObj = JSON.parse(localStorage.getItem('token_obj'));
      return {Authorization: 'bearer ' + tokenObj.access_token};
    }
    return {};
  }

  setToken() {
    if (localStorage.getItem('token_obj')) {
      const tokenObj = JSON.parse(localStorage.getItem('token_obj'));
      return {access_token: tokenObj.access_token};
    }
    return {};
  }
}
