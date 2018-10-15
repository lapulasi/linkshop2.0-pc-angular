import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';

export class AdminHttpClient extends HttpClient {
  private url = environment.service_url;

  private getUrl(path) {
    return this.url + path;
  }

  get(url: string, params?: any): Observable<any> {
    return super.get<any>(url, {params: this.getHttpParams(params)});
  }
  private getHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key.toString(), params[key]);
      });
    }
    return httpParams;
  }
}
