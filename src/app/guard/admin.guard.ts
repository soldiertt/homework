import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.auth.user.take(1).map(user => !!user && user.email === 'soldiertt@gmail.com').do(admin => {
      if (!admin) {
        console.log('access denied');
        this.router.navigate(['/']);
      }
    });
  }
}
