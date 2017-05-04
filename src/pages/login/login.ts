import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  email = '';
  password = '';
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private userService: UserService) {
  }

  login() {
    if (this.email == '' || this.password == '') {
      this.presentError();
    } else {
      this.userService.login(this.email, this.password, (user) => {
        if (user) {
          this.viewCtrl.dismiss();
        } else {
          this.presentError();
        }
      });
      this.email = '';
      this.password = '';
    }
  }

  presentError() {
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      message: 'Please enter a valid email and password.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
