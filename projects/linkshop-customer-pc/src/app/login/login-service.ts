import {Injectable} from "@angular/core";
import {WebHttpClient} from "../web.httpclient";
import {map} from "rxjs/internal/operators";

@Injectable({providedIn: 'root'})
export class LoginService {

  constructor(private http: WebHttpClient) {}

  login(account: any, password: any) {
    return this.http.post<any>(
      `/oauth/token?grant_type=password&scope=read&client_id=adminUser&client_secret=sec3333&username=${account}&password=${password}`,
      null).pipe(
        map(result => {
          if (result.access_token) {
            localStorage.setItem('token', result.access_token);
            return true;
          } else {
            return false;
          }
        })
    );
  }

  getInfo(phone: any) {
    const token = localStorage.getItem('token');
    return this.http.get(`/user/`, {phone: phone, access_token: token}).pipe(
      map(result => {
        localStorage.setItem('user', JSON.stringify({name: result.realName}));
        return result.belongOrgId;
      })
    );
  }

  getOrg(orgId: any) {
    return this.http.get(`/org/${orgId}`, null);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isLogin() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  loginOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
