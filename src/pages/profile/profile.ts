import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {
  user: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private platform: Platform,
              private userService: UserService) {
    this.user = this.userService.currentUser;
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('Dashboard');
  }

  editToggled() {
    console.log("edit toggled");
  }

}
