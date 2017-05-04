import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
              private alertCtrl: AlertController,
              private userService: UserService) {
  }

  login() {
    if (this.email == '' || this.password == '') {
      let alert = this.alertCtrl.create({
            title: 'Login Failed',
            message: 'Please enter a valid email and password.',
            buttons: ['Dismiss']
            });
        alert.present();
    } else {
      // this.userService.fetchUser(email)
    }
  }

}
