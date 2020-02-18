import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService){}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRole = route.data.role;

    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log('user in here: ', user);
        if (!user) {
          return false;
        } else {
          const role = user['role'];
          if (expectedRole == role) {
            return true;
          } else {
            console.log("unAuthorized ! ")
            this.router.navigateByUrl('/');
            return false;
          }
        }
      })
    );
  }
  }
  

