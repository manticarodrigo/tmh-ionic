import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserService } from '../providers/user-service';
import { ImageService } from '../providers/image-service';
import { SocketService } from '../providers/socket-service';

@Component({
  templateUrl: 'app.html'
})
export class TheManHome {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'loading';
  constructor(private platform: Platform,
              private menuCtrl: MenuController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private userService: UserService,
              private socketService: SocketService) {
    
    // Initizalize sockets
    this.socketService.init();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
    });

    this.userService.fetchCurrentUser()
      .subscribe(user => {
        let view = this.nav.getActive();
        switch (view.component.name) {
          case !user:
            this.nav.setRoot('login');
          case user && 'LoginPage':
            this.nav.setRoot('dashboard');
          default:
            return
        }
      });
  }

  profilePressed() {
    console.log("view profile pressed");
    this.menuCtrl.close();
    this.nav.setRoot('profile');
  }

  allPressed() {
    console.log("all projects pressed");
    this.menuCtrl.close();
    this.nav.setRoot('dashboard');
  }

  newPressed() {
    console.log("new project pressed");
    this.menuCtrl.close();
    this.nav.setRoot('onboarding');
  }

  logout() {
    console.log("logout pressed");
    this.menuCtrl.close();
    this.userService.logout()
    .then(() => {
      this.nav.setRoot('login');
    });
  }
}