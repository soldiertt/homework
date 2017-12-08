import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UsersService} from '../../service/users.service';
import DayItem from '../../model/day-item.class';
import {Subject} from 'rxjs/Subject';
import {ParamsService} from '../../service/params.service';
import DailyTask from '../../model/daily-task';

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
  score: number = 0;
  total: number;
  dailyTasks: DailyTask[] = [];

  constructor(private fb: FormBuilder,
              private userService: UsersService,
              private paramsService: ParamsService) {

    this.form = fb.group({});
  }

  ngOnInit() {
    this.paramsService.findDailyTasks()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(dailyTasks => {
        this.dailyTasks = dailyTasks;
        dailyTasks.forEach(task => {
          this.form.addControl(task.name, this.fb.control(false));
        });
    });

    this.userService.currentUser()
      .map(user => user.uid)
      .do(userId => this.userId = userId)
      .mergeMap(userId => this.userService.loadDayItemFromUser(userId))
      .takeUntil(this.ngUnsubscribe)
      .combineLatest(this.paramsService.findDailyTasks())
      .subscribe(([dayItem, dailyTasks]) => {
        if (dayItem) {
          this.dayItem = dayItem;
          this.score = dayItem.score;
          dailyTasks.forEach(task => {
            this.form.get(task.name).setValue(this._checked(task.name), {emitEvent: false});
          });
        }

        this.userService.totalUserPoints(this.userId)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(total => this.total = total);
      });

    this.form.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(values => {
        this.score = 0;
        const selectedItems = Object.keys(values).filter(checkboxKey => values[checkboxKey]);
        selectedItems.forEach(selected => {
          this.score += this.dailyTasks.find(task => task.name === selected).value;
        });
        this.userService.addUserDayItem(this.userId, {score: this.score, archived: false, items: selectedItems});
      });

    this.clock = Observable.interval(1000).map(tick => new Date()).share();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private _checked(item: string): boolean {
    return this.dayItem && this.dayItem.items.indexOf(item) !== -1;
  }
}
