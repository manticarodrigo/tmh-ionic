import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserService } from '../providers/user-service';
import { ImageService } from '../providers/image-service';
import { SocketService } from '../providers/socket-service'; 

@Component({
  templateUrl: 'app.html'
})
export class TheManHome {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'LoadingPage';
  constructor(private platform: Platform,
              private menuCtrl: MenuController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private storage: Storage,
              private userService: UserService,
              private imageService: ImageService,
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
          self.nav.setRoot('LoginPage');
        } else {
          console.log('Stored user found');
          self.userService.setCurrentUser(user, token)
          .then(user => {
            self.nav.setRoot('DashboardPage');
          })
          .catch(error => {
            console.log(error);
          });
        }
      });

      // }); // clear cache for login debug
    }

    profilePressed() {
      console.log("view profile pressed");
      this.menuCtrl.close();
      this.nav.setRoot('ProfilePage');
    }

    allPressed() {
      console.log("all projects pressed");
      this.menuCtrl.close();
      this.nav.setRoot('DashboardPage');
    }

    newPressed() {
      console.log("new project pressed");
      this.menuCtrl.close();
      this.nav.setRoot('OnboardingPage');
    }

    logout() {
      console.log("logout pressed");
      this.menuCtrl.close();
      this.nav.setRoot('LoginPage');
      this.userService.logout();
    }
}