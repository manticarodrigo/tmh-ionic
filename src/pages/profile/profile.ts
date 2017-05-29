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
  editing = false;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private platform: Platform,
              private userService: UserService) {
    this.user = this.userService.currentUser;
    this.user.createDateReadable = this.getDateStringFrom(this.user.createDate);
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('Dashboard');
  }

  editToggled() {
    console.log("edit toggled");
    this.editing = !this.editing;
  }

  getDateStringFrom(timestamp) {
    const date = new Date(timestamp);
    date.setDate(date.getDate());
    const string = date.toDateString();
    const stringArr = string.split(" ");
    const month = stringArr[1];
    const day = stringArr[2];
    const year = stringArr[3];
    var dateStr = month + ' ' + day + ', ' + year;
    return dateStr;
    ;
  }

}
