import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import Session from '../model/session.class';
import WordTry from '../model/word-try.class';
import {Observable} from 'rxjs/Observable';
import User from '../model/user.class';
import {AuthService} from './auth.service';

@Injectable()
export class UsersService {

  userCollection: AngularFirestoreCollection<User>;
  user: User;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.userCollection = this.afs.collection<User>('users');
    this.auth.user.subscribe(user => this.user = user);
  }

  findAll(): Observable<User[]> {
    return this.userCollection.valueChanges();
  }

  addUserSession(trials: WordTry[]): void {
    const newTrials = [];
    trials.forEach(trial => {
      newTrials.push({word: trial.word, successCount: trial.successCount, failureCount: trial.failureCount});
    });
    const session = {endDate: new Date(), trials: newTrials};
    console.log(this.user.uid);
    const userDoc = this.userCollection.doc(this.user.uid);
    userDoc.collection<Session>('sessions').add(session).then(resp => console.log('update ok'));
  }

  loadSessionsFromUser(findUser: User): Observable<Session[]> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${findUser.uid}`);
    return userRef.collection<Session>('sessions', ref => {
      return ref.orderBy('endDate', 'desc');
    }).valueChanges();
  }
}
