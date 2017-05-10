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
    let alert = this.alertCtrl.create({
      title: 'NEW PROJECT',
      message: 'Press start to begin a new project.',
      buttons: 
      [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
              console.log('Cancel pressed');
          }
      },
      {
          text: 'Start',
          handler: data => {
              this.navCtrl.setRoot('Onboarding')
          }
      }]
    });
    alert.present();
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    let width = this.platform.width();
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '65',
            left: width
          };
        }
      }
    };
    popover.onDidDismiss(data => {
      if (data == 'PROFILE') {
        this.navCtrl.setRoot('Profile');
      }
      if (data == 'ALL') {
        this.navCtrl.setRoot('Dashboard');
      }
      if (data == 'NEW') {
        this.navCtrl.setRoot('Onboarding');
      }
      if (data == 'LOGOUT') {
        this.userService.logout();
        this.navCtrl.setRoot('Login');
      }
    });
    popover.present({ev});
  }

  editToggled() {
    console.log("edit toggled");
  }

}
