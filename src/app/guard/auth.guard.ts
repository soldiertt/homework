import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.auth.user.take(1).map(user => !!user).do(loggedIn => {
      if (!loggedIn) {
        console.log('access denied');
        this.router.navigate(['/']);
      }
    });
  }
}
