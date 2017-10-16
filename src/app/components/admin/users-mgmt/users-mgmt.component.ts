import {Component} from '@angular/core';
import User from '../../../model/user.class';
import {UsersService} from '../../../service/users.service';
import Session from '../../../model/session.class';

declare var $: any;

@Component({
  templateUrl: './users-mgmt.component.html',
  styleUrls: ['./users-mgmt.component.css']
})
export class UsersManagementComponent {

  users: User[];
  sessions: Session[];
  selectedUser: User;

  constructor(private usersService: UsersService) {
    this.usersService.findAll().subscribe(users => {
      this.users = users;
    });
  }

  loadUser($event, user: User) {
    $event.preventDefault();
    this.selectedUser = user;
    this.usersService.loadSessionsFromUser(user).subscribe(sessions => {
      this.sessions = sessions;
      setTimeout(() => {
        $('.collapsible').collapsible();
      }, 50);
    });
  }

  isSelected(user: User) {
    return this.selectedUser && (user.uid === this.selectedUser.uid);
  }
}
