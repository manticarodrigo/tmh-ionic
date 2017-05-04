import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-dropdown',
  templateUrl: 'dropdown.html',
})
export class Dropdown {
  user: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
    } else {
      console.log("No current user in dropdown");
    }
  }

}
