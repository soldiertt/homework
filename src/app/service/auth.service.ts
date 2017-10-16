import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import User from '../model/user.class';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

@Injectable()
export class AuthService {

  user: Observable<User>;
  isAdmin: boolean;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
    this.user.subscribe(user => {
      this.isAdmin = user && user.email === 'soldiertt@gmail.com';
    });
  }

  login() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account'
    });
    this.afAuth.auth.signInWithPopup(googleAuthProvider).then(credential => {
      this.updateUserData(credential.user);
    }).catch(error => {
      console.log(error);
    });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
    return userRef.set(data);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

}
