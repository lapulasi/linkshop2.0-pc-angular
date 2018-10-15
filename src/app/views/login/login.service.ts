import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminHttpClient} from '../../admin.httpclient';
import {environment} from "../../../environments/environment";

@Injectable()
export class LoginService {

  private url = environment.service_url;

  private getUrl(path) {
    return this.url + path;
  }

  constructor(private http: AdminHttpClient,
              private httpClient: HttpClient) {
  }

  login(userName: any, password: any) {
    userName = userName.replace(/^\s+|\s+$/g, ''); // 去掉两头空格
    return this.http.post<any>(this.getUrl('/oauth/token?grant_type=password&scope=read&client_id=adminUser&client_secret=sec3333&username=' + userName + '&password=' + password), null);
  }

  logOut() {
    localStorage.removeItem('currentUser');
  }

  getUser(token, phone) {
    return this.httpClient.get<any>(this.getUrl('/user/?phone=' + phone + '&access_token=' + token));
  }

}
