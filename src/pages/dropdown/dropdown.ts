import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ImageService } from '../../providers/image-service';


@IonicPage()
@Component({
  selector: 'page-dropdown',
  templateUrl: 'dropdown.html',
})
export class Dropdown {
  user: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private userService: UserService,
              private imageService: ImageService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
    } else {
      console.log("No current user in dropdown");
    }
  }

  profilePressed() {
    console.log("view profile pressed");
    this.viewCtrl.dismiss('PROFILE');
  }

  allPressed() {
    console.log("all projects pressed");
    this.viewCtrl.dismiss('ALL');
  }

  newPressed() {
    console.log("new project pressed");
    this.viewCtrl.dismiss('NEW');
  }

  logout() {
    this.viewCtrl.dismiss('LOGOUT');
  }

}
