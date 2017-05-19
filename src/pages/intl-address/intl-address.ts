import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-intl-address',
  templateUrl: 'intl-address.html',
})
export class IntlAddress {

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  done() {
    console.log('done pressed');
  }

  dismiss() {
    console.log("dismiss pressed");
    this.viewCtrl.dismiss();
  }

}
