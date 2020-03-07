// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { take, map } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AutomaticLoginGuard implements CanActivate  {
//   constructor(private router: Router, private auth: AuthService) { }
//   canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
//     return this.auth.user.pipe(
//       take(1),
//       map(user => {
//         console.log('user in here 1234: ', user);
//         if (!user) {
//           return false;
//         } else {
//           const role = user['role'];
//           if (role == 'USER') {
//             console.log("routing..")
//             this.router.navigateByUrl('/place/add');
//           } else if (role == 'USER') {
//             this.router.navigateByUrl('/place/add');
//           }
//           return false;
//         }
//       })
//     );
//   }
// }
