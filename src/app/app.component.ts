import { Component, ViewChild } from '@angular/core';
import { Nav, MenuController } from 'ionic-angular';

import { UserService } from '../providers/user-service';
import { SocketService } from '../providers/socket-service';

@Component({
  templateUrl: 'app.html'
})
export class TheManHome {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'loading';
  constructor(
    private menuCtrl: MenuController,
    private userService: UserService,
    private socketService: SocketService
  ) {
    // initialize sockets
    this.socketService.init();
    // check for current user
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (!user) {
          console.log('no user');
          this.nav.setRoot('login');
        }
      });
  }

  profilePressed() {
    console.log('view profile pressed');
    this.menuCtrl.close();
    this.nav.setRoot('profile');
  }

  allPressed() {
    console.log('all projects pressed');
    this.menuCtrl.close();
    this.nav.setRoot('dashboard');
  }

  newPressed() {
    console.log('new project pressed');
    this.menuCtrl.close();
    this.nav.setRoot('onboarding');
  }

  logout() {
    console.log('logout pressed');
    this.menuCtrl.close();
    this.userService.logout()
    .then(() => {
      this.nav.setRoot('login');
    });
  }
}