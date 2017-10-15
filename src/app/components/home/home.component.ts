import {Component} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(private authService: AuthService) {}

  isAuth(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    this.authService.login();
  }

}
