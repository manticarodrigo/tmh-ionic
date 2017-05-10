import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-intl-address',
  templateUrl: 'intl-address.html',
})
export class IntlAddress {

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  done() {
    console.log('done pressed');
  }

}
