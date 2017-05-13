import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class Details {
  user: any;
  project: any;
  types = {
    BEDROOM: 'BEDROOM',
    LIVING_ROOM: 'LIVING ROOM',
    MULTIPURPOSE_ROOM: 'MULTIPURPOSE ROOM',
    STUDIO: 'STUDIO',
    DINING_ROOM: 'DINING ROOM',
    HOME_OFFICE: 'OFFICE'
  }
  status = {
    UPLOADED_DRAWING: true,
    UPLOADED_INSPIRATION: false,
    UPLOADED_FURNITURE: false
  };
  view = 'DRAWING';
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private platform: Platform) {
    this.user = this.userService.currentUser;
    this.project = this.navParams.get('project');
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

  selectTab() {
    console.log("Toggling tab dropdown!");
    let popover = this.popoverCtrl.create('TabDropdown', {
      tabs: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
    });
    popover.onDidDismiss(data => {
      if (data) {
        const tab = data.replace(" ", "");
        this.navCtrl.setRoot(tab);
      }
    });
    popover.present();
  }

}
