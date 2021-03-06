import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import Word from '../model/word.class';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Injectable()
export class WordsService {

  wordCollection: AngularFirestoreCollection<Word>;

  constructor(private afs: AngularFirestore) {
    this.wordCollection = this.afs.collection<Word>('words', ref => ref.orderBy('label'));
  }

  findAll(): Observable<Word[]> {
    return this.wordCollection.snapshotChanges().map(words => {
      return words.map(word => {
        const data = word.payload.doc.data() as Word;
        const id = word.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  create(wordLabel: string, wordDescription?: string): void {
    let newWord;
    if (wordDescription) {
      newWord = {label: wordLabel, explain: wordDescription};
    } else {
      newWord = {label: wordLabel};
    }
    this.wordCollection.add(newWord).then(resp => console.log(resp));
  }

  delete(word: Word): void {
    this.wordCollection.doc(word.id).delete().then(resp => console.log('word deleted'));
  }
}
