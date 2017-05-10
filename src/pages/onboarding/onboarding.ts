import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class Onboarding {
  step = 0;
  type = '';
  styleQuestions = {
    1: {
      answer: '',
      answering: false
    },
    2: {
      answer: '',
      answering: false
    },
    3: {
      answer: '',
      answering: false
    },
    4: {
      answer: '',
      answering: false
    }
  }
  package = 0;
  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  startProject() {
    console.log("start pressed");
    this.step = 1;
  }

  selectedType(type) {
    console.log("selected room type:");
    console.log(type);
    this.step = 2;
    this.type = type;
    this.styleQuestions[1].answering = true;
  }

  selectedStyle(index, style) {
    console.log("selected index and style:");
    console.log(index, style);
    this.styleQuestions[index].answer = style;
    this.styleQuestions[index].answering = false;
    if (index < 4) {
      this.styleQuestions[index + 1].answering = true;
    } else if (index == 4) {
      this.step = 3;
    }
  }

  selectPackage(n) {
    console.log("selected package:");
    console.log(n);
    this.package = n;
    this.step = 4;
  }

}