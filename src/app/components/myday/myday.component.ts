import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UsersService} from '../../service/users.service';
import DayItem from '../../model/day-item.class';
import {Subject} from 'rxjs/Subject';

@Component({
  templateUrl: './myday.component.html',
  styleUrls: ['./myday.component.css']
})
export class MyDayComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  userId: string;
  clock: Observable<Date>;
  dayItem: DayItem;
  form: FormGroup;
  dayMaxScore: number;
  score: number = 0;
  happy: boolean = false;
  total: number;

  constructor(private fb: FormBuilder,
              private userService: UsersService) {
    this.form = fb.group({});
    this.form.addControl('daybook', this.fb.control(false));
    this.form.addControl('shower', this.fb.control(false));
    this.form.addControl('homework', this.fb.control(false));
    this.form.addControl('words', this.fb.control(false));
    this.form.addControl('teeth', this.fb.control(false));
    this.form.addControl('drink', this.fb.control(false));
    this.form.addControl('sleep', this.fb.control(false));
  }

  ngOnInit() {
    this.userService.currentUser()
      .map(user => user.uid)
      .do(userId => this.userId = userId)
      .mergeMap(userId => this.userService.loadDayItemFromUser(userId))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(dayItem => {
        this.dayItem = dayItem;
        this.score = dayItem.score;

        const options = {emitEvent: false};

        this.form.get('daybook').setValue(this._checked('daybook'), options);
        this.form.get('shower').setValue(this._checked('shower'), options);
        this.form.get('homework').setValue(this._checked('homework'), options);
        this.form.get('words').setValue(this._checked('words'), options);
        this.form.get('teeth').setValue(this._checked('teeth'), options);
        this.form.get('drink').setValue(this._checked('drink'), options);
        this.form.get('sleep').setValue(this._checked('sleep'), options);

        this.dayMaxScore = Object.keys(this.form.controls).length;
        this.checkIfHappy();
        this.userService.totalUserPoints(this.userId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(total => this.total = total);
      });

    this.form.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(values => {
        const selectedItems = Object.keys(values).map(checkboxKey => {
          return {key: checkboxKey, value: values[checkboxKey]};
        }).filter(item => item.value);

        this.score = selectedItems.length;
        if (this.score === this.dayMaxScore) {
          this.score++;
        }
        this.checkIfHappy();
        this.userService.addUserDayItem(this.userId, {score: this.score, archived: false, items: selectedItems.map(item => item.key)});
      });

    this.clock = Observable.interval(1000).map(tick => new Date()).share();

  }

  private checkIfHappy() {
    if (this.score >= this.dayMaxScore) {
      this.happy = true;
    } else {
      this.happy = false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private _checked(item: string): boolean {
    return this.dayItem && this.dayItem.items.indexOf(item) !== -1;
  }
}
