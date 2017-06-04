import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
})
export class ConfirmPage {
  message: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.message = this.navParams.get('message');
  }

  submit() {
    console.log("submit pressed");
    this.viewCtrl.dismiss(true);
  }

  dismiss() {
    console.log("dismiss pressed");
    this.viewCtrl.dismiss();
  }

}
