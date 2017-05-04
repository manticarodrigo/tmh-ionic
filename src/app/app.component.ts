import { Component } from '@angular/core';
import { Platform, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

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
              private storage: Storage) {
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
      this.storage.get('user').then((storedUser) => {
        if (!storedUser || !storedUser.accessToken) {
          console.log('No stored user found!')
          let modal = self.modalCtrl.create('Login');
          // modal.present();
        } else if (storedUser.accessToken) {
          console.log('Stored user found: ', storedUser);
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