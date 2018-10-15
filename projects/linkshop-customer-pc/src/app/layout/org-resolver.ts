import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {WebHttpClient} from "../web.httpclient";

@Injectable()
export class OrgResolver implements Resolve<any> {

  constructor(private http: WebHttpClient) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {

    const orgCode = route.params.orgcode;

    return this.http.get(`/org/bycode/${orgCode}`, null);
  }

}
