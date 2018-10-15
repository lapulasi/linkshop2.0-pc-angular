import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {LoginService} from "./login/login-service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivateChild {

  constructor(private router: Router, private login: LoginService) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    if (this.login.isLogin()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
