import { Component } from '@angular/core';
import { Platform, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserService } from '../providers/user-service';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class TheManHome {
  rootPage:any = TabsPage;

    constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private storage: Storage,
              private userService: UserService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Fetch current user
      this.fetchCurrentUser();
    });
  }

  fetchCurrentUser() {
    // console.log('erasing storage for login debugging');
    this.storage.clear().then(() => { // clear cache for login debugging
      let self = this;
      Promise.all([this.storage.get('user'), this.storage.get('headers')])
      .then(data => {
        const user = data[0];
        const headers = data[1];
        if (!user || !headers) {
          console.log('No stored user found')
          let modal = self.modalCtrl.create('Login');
          modal.present();
        } else {
          console.log('Stored user found');
          self.userService.setCurrentUser(user, headers);
        }
      });

      }); // clear cache for login debug
    }

    presentError(message) {
        let alert = this.alertCtrl.create({
            title: 'Login Failed!',
            message: message,
            buttons: ['Dismiss']
            });
        alert.present();
    }
}