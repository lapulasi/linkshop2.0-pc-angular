import { Component, OnInit } from '@angular/core';
import {LoginService} from "./login-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  account: any;
  passwd: any;
  errorMsg: any;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {}

  login() {

    if (!this.account) {
      this.errorMsg = '请输入用户名';
      return false;
    } else if (!this.passwd) {
      this.errorMsg = '请输入密码';
      return false;
    }

    this.loginService.login(this.account, this.passwd).subscribe(result => {
      if (!result) {
        this.errorMsg = '登录失败';
      } else {
        this.loginService.getInfo(this.account).subscribe(orgId => {
          this.loginService.getOrg(orgId).subscribe(data => {
            this.router.navigate([`/${data.orgCode}/index`]);
          });
        });
      }
    });


  }

}
