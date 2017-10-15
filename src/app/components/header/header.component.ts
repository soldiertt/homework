import {Component} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService) {}

  login($event) {
    $event.preventDefault();
    this.authService.login();
  }

  logout($event) {
    $event.preventDefault();
    this.authService.logout();
  }

  isAuth() {
    return this.authService.isAuthenticated();
  }

  getUser() {
    return this.authService.user;
  }

}
