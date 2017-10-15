import {Component} from '@angular/core';
import Word from '../../model/word.class';
import WordTry from '../../model/word-try.class';
import {WordsService} from '../../service/words.service';
import {UsersService} from '../../service/users.service';

declare var $: any;

@Component({
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.css']
})
export class WordsComponent {

  readonly SESSION_ITEMS: number = 5;
  readonly REWRITE_IF_FAILURE_COUNT: number = 2;
  words: Word[];
  previousWord: Word;
  randomWord: Word;
  inputLabel: string;
  sessionStarted: boolean;
  sessionEnded: boolean;
  speechSynthesis: SpeechSynthesisUtterance;
  session: WordTry[] = [];

  constructor(private wordsService: WordsService, private usersService: UsersService) {
    this.wordsService.findAll().subscribe(words => {
      this.words = words;
    });
    this.speechSynthesis = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    this.speechSynthesis.voice = voices[0];
  }

  startSession() {
    this.sessionStarted = true;
    this.sessionEnded = false;
    this.selectRandomWord();
  }

  readWord(textField?) {
    this.speechSynthesis.text = this.randomWord.label;
    speechSynthesis.speak(this.speechSynthesis);
    if (textField) {
      textField.focus();
    }
  }

  readExplanation() {
    this.speechSynthesis.text = this.randomWord.explain;
    speechSynthesis.speak(this.speechSynthesis);
  }

  checkWordSpelling(textField): void {
    $('#answer-ok').stop().hide();
    $('#answer-ko').stop().hide();
    const wordIndex = this.session.map(trial => trial.word.id).indexOf(this.randomWord.id);
    if (this.inputLabel.trim().toLowerCase() === this.randomWord.label) {
      $('#answer-ok').slideDown(1000).delay(6000).slideUp();
      if (wordIndex !== -1) {
        this.session[wordIndex].successCount++;
      } else {
        this.session.push(new WordTry(this.randomWord, 1, 0));
      }
    } else {
      $('#answer-ko').slideDown(1000).delay(6000).slideUp();
      if (wordIndex !== -1) {
        this.session[wordIndex].failureCount++;
        this.session[wordIndex].successCount = 0;
      } else {
        this.session.push(new WordTry(this.randomWord, 0, 1));
      }
    }
    this.inputLabel = '';
    this.previousWord = this.randomWord;
    this.sessionEnded = this.checkSessionEnded();
    if (!this.sessionEnded) {
      setTimeout(() => {
        this.selectRandomWord();
        textField.focus();
      }, 3000);
    } else {
      this.usersService.addUserSession(this.session);
      this.sessionStarted = false;
      this.session = [];
      this.previousWord = undefined;
    }
  }

  private selectRandomWord(): void {
    if (this.session.length === this.SESSION_ITEMS) {
      this.randomWord = this.session[Math.floor(Math.random() * this.session.length)].word;
    } else {
      this.randomWord = this.words[Math.floor(Math.random() * this.words.length)];
    }
    if (this.session.some(trial => {
        return this.randomWord.id === trial.word.id && ((trial.successCount >= 1 && trial.failureCount === 0)
          || trial.successCount >= this.REWRITE_IF_FAILURE_COUNT);
      })) {
      this.selectRandomWord();
    } else {
      this.readWord();
    }
  }

  private checkSessionEnded(): boolean {
    return this.validResponsesCount() >= this.SESSION_ITEMS;
  }

  validResponsesCount(): number {
    return this.session.filter(trial => {
      return (trial.successCount >= 1 && trial.failureCount === 0) || trial.successCount >= this.REWRITE_IF_FAILURE_COUNT;
    }).length;
  }
}
