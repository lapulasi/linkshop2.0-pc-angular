import {Component, OnInit} from '@angular/core';
import {User} from "./User";
import {LoginService} from "./login.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  user: User = new User('', '');
  status = true;

  constructor(private service: LoginService,
              private router: Router) {

  }

  ngOnInit() {
    this.service.logOut();
  }

  submitForm() {
    this.status = false;
    this.service.login(this.user.userName, this.user.userPwd).subscribe(data => {
      console.log(JSON.stringify(data, null, 4))
      const token = data.access_token;
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('token_obj', JSON.stringify(data));
      if (token) {
        this.status = true;
        this.getUser(token);
      }
    });
  }

  getUser(token) {
    this.service.getUser(token, this.user.userName).subscribe(data => {
      console.log(JSON.stringify(data, null, 4))
      localStorage.setItem('currentUser', JSON.stringify(data));
      this.router.navigate(['/dashboard']);
    });
  }


}
