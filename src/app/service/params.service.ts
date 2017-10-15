import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import Word from '../model/word.class';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import Param from '../model/param.class';

@Injectable()
export class ParamsService {

  paramCollection: AngularFirestoreCollection<Param>;
  MAX_WORDS_IN_SESSION: number;
  REWRITE_IF_FAILURE_COUNT: number;

  constructor(private afs: AngularFirestore) {
    this.paramCollection = this.afs.collection<Param>('params');
    this.findAll().subscribe(params => {
      params.forEach(param => {
        switch (param.id) {
          case 'max_words_in_session':
            this.MAX_WORDS_IN_SESSION = param.value;
            break;
          case 'rewrite_if_failure_count':
            this.REWRITE_IF_FAILURE_COUNT = param.value;
            break;
        }
      });
    });
  }

  findAll(): Observable<Param[]> {
    return this.paramCollection.snapshotChanges().map(params => {
      return params.map(param => {
        const data = param.payload.doc.data() as Param;
        const id = param.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  update(key: string, value: number): void {
    this.paramCollection.doc(key).update({value}).then(resp => console.log('param updated'));
  }

}
