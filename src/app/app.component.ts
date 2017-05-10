import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserService } from '../providers/user-service';
import { SocketService } from '../providers/socket-service'; 

@Component({
  templateUrl: 'app.html'
})
export class TheManHome {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'Login';

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private alertCtrl: AlertController,
              private storage: Storage,
              private userService: UserService,
              private socketService: SocketService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
      // Fetch current user
      this.fetchCurrentUser();
      // Initizalize sockets
      this.socketService.init();
    });
  }

  fetchCurrentUser() {
    // console.log('erasing storage for login debugging');
    // this.storage.clear().then(() => { // clear cache for login debugging
      let self = this;
      Promise.all([this.storage.get('user'), this.storage.get('token')])
      .then(data => {
        const user = data[0];
        const token = data[1];
        if (!user || !token) {
          console.log('No stored user found');
          console.log(user);
          console.log(token);
        } else {
          console.log('Stored user found');
          self.userService.setCurrentUser(user, token)
          .then(user => {
            this.nav.setRoot('Onboarding');
          })
          .catch(error => {
            console.log(error);
          });
        }
      });

      // }); // clear cache for login debug
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