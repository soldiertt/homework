import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import User from '../model/user.class';
import Session from '../model/session.class';
import WordTry from '../model/word-try.class';
import * as moment from 'moment';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class UsersService {

  user: firebase.User;
  userCollection: AngularFirestoreCollection<User>;
  userDocId: string;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.userCollection = this.afs.collection<User>('users');
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      this.initUser();
    });
  }

  initUser(): void {
    this.afs.collection<User>('users', ref => {
      return ref.where('authId', '==', this.user.uid);
    }).snapshotChanges().map(users => {
      return users.map(user => user.payload.doc.id);
    }).subscribe(ids => {
      if (ids.length === 0) {
        this.create({authId: this.user.uid});
      } else {
        this.userDocId = ids[0];
      }
    });
  }

  private create(user: any): void {
    this.userCollection.add(user).then(resp => this.userDocId = resp.id);
  }

  addUserSession(trials: WordTry[]): void {
    const newTrials = [];
    trials.forEach(trial => {
      newTrials.push({word: trial.word, successCount: trial.successCount, failureCount: trial.failureCount});
    });
    const session = {endDate: moment().format('DD-MM-YYYY HH:mm:ss'), trials: newTrials};
    const userDoc = this.userCollection.doc(this.userDocId);
    userDoc.collection<Session>('sessions').add(session).then(resp => console.log('update ok'));
  }
}
