import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ImageService } from '../../providers/image-service';

@IonicPage()
@Component({
  selector: 'page-dropdown',
  templateUrl: 'dropdown.html',
})
export class Dropdown {
  user: any;
  image64: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService,
              private imageService: ImageService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
      this.imageService.getImage(this.user.portraitId, this.userService.headers, (data) => {
        if (data) {
          console.log("Adding data to dropdown image");
          console.log(data);
          this.image64 = data;
        } else {
          console.log("No image found");
        }
      });
    } else {
      console.log("No current user in dropdown");
    }
  }

  logout() {
    this.userService.logout();
    this.navCtrl.setRoot('Login');
  }

}
