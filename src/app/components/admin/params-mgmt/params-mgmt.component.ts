import {Component} from '@angular/core';
import {WordsService} from '../../../service/words.service';
import Word from '../../../model/word.class';
import {ParamsService} from '../../../service/params.service';
import Param from '../../../model/param.class';

@Component({
  templateUrl: './params-mgmt.component.html',
  styleUrls: ['./params-mgmt.component.css']
})
export class ParamsManagementComponent {

  params: Param[];
  editing: Param;
  paramNewValue: number;

  constructor(private paramsService: ParamsService) {
    this.paramsService.findAll().subscribe(params => {
      this.params = params;
    });
  }

  editParam($event, param: Param) {
    $event.preventDefault();
    this.editing = param;
  }

  updateParam() {
    this.paramsService.update(this.editing.id, this.paramNewValue);
    this.editing = undefined;
    this.paramNewValue = undefined;
  }
}
