import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  user: firebase.User;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      console.log('login success');
    }).catch(error => {
      console.log(error);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.user !== undefined && this.user !== null;
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && this.user.email === 'soldiertt@gmail.com';
  }
}
