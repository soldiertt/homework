import {Component} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(public auth: AuthService) {}


}
