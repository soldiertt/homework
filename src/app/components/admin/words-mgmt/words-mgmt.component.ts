import {Component} from '@angular/core';
import {WordsService} from '../../../service/words.service';
import Word from '../../../model/word.class';

@Component({
  templateUrl: './words-mgmt.component.html',
  styleUrls: ['./words-mgmt.component.css']
})
export class WordsManagementComponent {

  words: Word[];
  newWord: string;

  constructor(private wordsService: WordsService) {
    this.wordsService.findAll().subscribe(words => this.words = words);
  }

  deleteWord($event, word: Word): void {
    $event.preventDefault();
    this.wordsService.delete(word);
  }

  addWord() {
    if (this.newWord.trim() !== '') {
      this.wordsService.create(this.newWord.trim());
      this.newWord = '';
    }
  }
}
