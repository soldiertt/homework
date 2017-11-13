import {Component} from '@angular/core';
import {WordsService} from '../../../service/words.service';
import Word from '../../../model/word.class';

declare var jQuery: any;

@Component({
  templateUrl: './words-mgmt.component.html',
  styleUrls: ['./words-mgmt.component.css']
})
export class WordsManagementComponent {

  words: Word[];
  newWord: string;
  newWordDescription: string;
  speechSynthesis: SpeechSynthesisUtterance;

  constructor(private wordsService: WordsService) {
    this.wordsService.findAll().subscribe(words => {
      this.words = words;
      setTimeout(() => {
          jQuery('.tooltipped').tooltip({delay: 50});
      }, 50);
    });
    this.speechSynthesis = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    this.speechSynthesis.voice = voices[0];
  }

  deleteWord($event, word: Word): void {
    $event.preventDefault();
    this.wordsService.delete(word);
  }

  addWord() {
    if (this.newWord.trim() !== '') {
      this.wordsService.create(this.newWord.trim(), this.newWordDescription);
      this.newWord = '';
      this.newWordDescription = undefined;
    }
  }

  read(text: string) {
    this.speechSynthesis.text = text;
    speechSynthesis.speak(this.speechSynthesis);
  }
}
