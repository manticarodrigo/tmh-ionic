import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {
  user: any;
  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController,
              private userService: UserService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
    } else {
      console.log("No current user in dashboard");
    }
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    popover.present();
  }

}
