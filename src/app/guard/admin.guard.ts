import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {AuthService} from '../service/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isAdmin();
  }
}