import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import Session from '../model/session.class';
import WordTry from '../model/word-try.class';
import {Observable} from 'rxjs/Observable';
import User from '../model/user.class';
import {AuthService} from './auth.service';
import DayItem from '../model/day-item.class';
import * as moment from 'moment';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class UsersService {

  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.userCollection = this.afs.collection<User>('users');
  }

  currentUser(): Observable<User> {
    return this.auth.user;
  }

  findAll(): Observable<User[]> {
    return this.userCollection.valueChanges();
  }

  addUserSession(userId: string, trials: WordTry[]): void {
    const newTrials = [];
    trials.forEach(trial => {
      newTrials.push({word: trial.word, successCount: trial.successCount, failureCount: trial.failureCount});
    });
    const session = {endDate: new Date(), trials: newTrials};

    const userDoc = this.userCollection.doc(userId);
    userDoc.collection<Session>('sessions').add(session).then(resp => console.log('update ok'));

  }

  loadSessionsFromUser(findUser: User): Observable<Session[]> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${findUser.uid}`);
    return userRef.collection<Session>('sessions', ref => {
      return ref.orderBy('endDate', 'desc');
    }).valueChanges();
  }

  addUserDayItem(userId: string, dayItem: DayItem): void {
    const dayKey = moment().format('YYYY-MM-DD');
    const dayItemRef: AngularFirestoreDocument<DayItem> = this.afs.doc(`users/${userId}/dayitems/${dayKey}`);
    dayItemRef.set(dayItem).then(resp => console.log('update ok'));
  }

  loadDayItemFromUser(userId: string): Observable<DayItem> {
    const dayKey = moment().format('YYYY-MM-DD');
    const dayItemRef: AngularFirestoreDocument<DayItem> = this.afs.doc(`users/${userId}/dayitems/${dayKey}`);
    return dayItemRef.valueChanges();
  }

  totalUserPoints(userId: string): Observable<number> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userId}`);
    return userRef.collection<DayItem>('dayitems', ref => {
      return ref.where('archived', '==', false);
    })
    .valueChanges()
    .map((dayitems: DayItem[]) => dayitems.reduce((sum, dayitem) => dayitem.score + sum , 0));
  }
}
