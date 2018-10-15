import {Injectable} from '@angular/core';
import {AdminHttpClient} from "../../admin.httpclient";

@Injectable()
export class DashboardService {

  constructor(private adminHttp: AdminHttpClient) {
  }

  getDataByDate(param) {
    return this.adminHttp.get('/org/staff/by/date', param);
  }

  getDataByLevel(param) {
    return this.adminHttp.get('/org/staff/by/level', param);
  }

  getDataByGender(param) {
    return this.adminHttp.get('/org/staff/by/gender', param);
  }

  getDataByAge(param) {
    return this.adminHttp.get('/org/staff/by/age', param);
  }

  getOrgLevel(param) {
    return this.adminHttp.get('/org/code/level', param);
  }

}
