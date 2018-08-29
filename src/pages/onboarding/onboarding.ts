import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  ModalController,
  AlertController
} from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

@IonicPage({
  name: 'onboarding'
})
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  user: any;
  step = 0;
  type = '';
  styleQuestions = {
    1: { answer: '', answering: false },
    2: { answer: '', answering: false },
    3: { answer: '', answering: false },
    4: { answer: '', answering: false }
  }
  package = 0;
  additionalRooms = {
    room1: '',
    room2: ''
  }
  finalQuestion = 1;
  zip = '';
  shares = '';
  pet = false;
  limitedAccess = false;
  budget = 0;
  costs = {
    1: 399,
    2: 699,
    3: 999
  }
  billing = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  }
  card = {
    number: '',
    name: '',
    expDate: null,
    code: ''
  }
  saveCard = true;
  savedCard: any;
  payWithSaved = false;
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          // this.fetchCreditCard();
        }
      });
  }

  fetchCreditCard() {
    console.log('fetching credit card');
    this.userService.fetchCreditCard(this.user)
    .then(data => {
      console.log('onboarding component received credit card data:', data);
      if (Object.keys(data).length !== 0) {
        this.savedCard = data;
      }
    });
  }

  backPressed() {
    console.log('back pressed');
    switch (this.step) {
      case 4:
        this.finalQuestion = 1;
      case 3:
        this.styleQuestions[1].answering = true;
      case 2:
      case 3:
        this.styleQuestions = {
          1: { answer: '', answering: false },
          2: { answer: '', answering: false },
          3: { answer: '', answering: false },
          4: { answer: '', answering: false }
        }
      default:
        this.step--;
    }
  }

  homePressed() {
    console.log('logo pressed');
    this.navCtrl.setRoot('dashboard');
  }

  startProject() {
    console.log('start pressed');
    this.step = 1;
  }

  selectedType(type) {
    console.log('selected room type:', type);
    this.step = 2;
    this.type = type;
    this.styleQuestions[1].answering = true;
  }

  selectedStyle(index, style) {
    console.log('selected index and style:', index, style);
    this.styleQuestions[index].answer = style;
    this.styleQuestions[index].answering = false;
    if (index < 4) {
      this.styleQuestions[index + 1].answering = true;
    } else if (index === 4) {
      this.step = 3;
    }
  }

  selectedPackage(n) {
    console.log('selected package:', n);
    if (n === 3) {
      let modal = this.modalCtrl.create('AdditionalRoom', { rooms: 2 });
      modal.onDidDismiss(data => {
        console.log('received data from modal', data);
        if (data && data.room1 && data.room2) {
          this.package = n;
          this.additionalRooms.room1 = data.room1;
          this.additionalRooms.room2 = data.room2;
          this.step = 4;
        } else {
          this.step = 3;
        }
      });
      modal.present();
    } else if (n === 2) {
      let modal = this.modalCtrl.create('AdditionalRoom', { rooms: 1 });
      modal.onDidDismiss(data => {
        console.log('received data from modal', data);
        if (data && data.room1) {
          this.package = n;
          this.additionalRooms.room1 = data.room1;
          this.step = 4;
        } else {
          this.step = 3;
        }
      });
      modal.present();
    } else {
      this.package = n;
      this.step = 4;
    }
  }

  requestInternational() {
    console.log('international address pressed');
    let modal = this.modalCtrl.create('intl-address');
    modal.onDidDismiss(data => {
      console.log(data);
    });
    modal.present();
  }

  validateZip() {
    let num = this.zip.split('-').join(''); // remove hyphens
    if (num.match(/^[0-9]+$/) == null) {
      console.log('num is not numeric', num);
      num = num.slice(0, -1);
    }
    this.zip = num;
  }

  submittedZip() {
    console.log('zip submitted:', this.zip);
    const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.zip);
    if (isValidZip) {
      this.finalQuestion = 2;
    } else {
      let alert = this.alertCtrl.create({
        title: 'Bad Zip',
        message: 'Please enter a valid 5-digit U.S. zip code.',
        buttons: ['DISMISS']
      });
      alert.present();
    }
  }

  sharesWith(answer) {
    console.log('shares with submitted:', answer);
    this.shares = answer;
    this.finalQuestion = 3;
  }

  hasPet(bool) {
    console.log('has pet:', bool);
    this.pet = bool;
    this.finalQuestion = 4;
  }

  hasLimitedAccess(bool) {
    console.log('has limited access:', bool);
    this.limitedAccess = bool;
    this.finalQuestion = 5;
  }

  hasBudget(n) {
    console.log('has budget:', n);
    this.budget = n;
    // this.step = 5;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);
    this.projectService.createProject({
      room: this.type,
      status: 'DETAILS',
      shared_with: this.shares,
      budget: this.budget,
      end_date: endDate.toISOString(),
      pet_friendly: this.pet,
      limited_access: this.limitedAccess,
      style: 'Style goes here...',
      zipcode: this.zip,
      client: this.userService.currentUser.id
    })
      .then(
        res => {
          console.log(res);
          this.navCtrl.setRoot('dashboard');
        },
        err => {
          console.log(err);
        }
      )
  }

  validateCardNumber() {
    let num = this.card.number.split('-').join(''); // remove hyphens
    if (num.match(/^[0-9]+$/) == null) {
      console.log('num is not numeric', num);
      num = num.slice(0, -1);
    }
    if (num.length > 0) {
      num = num.match(new RegExp('.{1,4}', 'g')).join('-');
    }
    this.card.number = num;
  }

  paymentPressed() {
    console.log('payment pressed');
  }

  paypalPressed() {
    console.log('paypal pressed');
  }

}