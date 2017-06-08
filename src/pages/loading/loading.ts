import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage({
  name: 'loading',
  priority: 'high'
})
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService) {
    // Fetch current user
    this.userService.fetchCurrentUser()
    .then(user => {
      if (user) {
        this.navCtrl.setRoot('dashboard');
      } else {
        this.navCtrl.setRoot('login');
      }
    });
  }

  

}
