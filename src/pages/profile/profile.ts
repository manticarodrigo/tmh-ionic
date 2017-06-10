import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: any;
  editing = false;
  oldPassword = '';
  newPassword1 = '';
  newPassword2 = '';
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private platform: Platform,
              private userService: UserService) {
    this.userService.fetchCurrentUser()
    .then(user => {
      if (user) {
        this.user = user;
        this.user.createDateReadable = this.getDateStringFrom(this.user.createDate);
      } else {
        this.navCtrl.setRoot('login');
      }
    });
  }

  homePressed() {
    console.log("logo pressed");
    this.navCtrl.setRoot('dashboard');
  }

  editToggled() {
    console.log("edit toggled");
    if (this.editing) {
      this.savePressed();
    } else {
      this.editing = !this.editing;
    }
  }

  getDateStringFrom(timestamp) {
    const date = new Date(timestamp);
    date.setDate(date.getDate());
    const string = date.toDateString();
    const stringArr = string.split(" ");
    const month = stringArr[1];
    const day = stringArr[2];
    const year = stringArr[3];
    var dateStr = month + ' ' + day + ', ' + year;
    return dateStr;
    ;
  }

  fileChanged(event) {
    const self = this;
    console.log("file changed:");
    const file = event.target.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.onload = function() {
      var arrayBuffer = this.result,
      array = new Uint8Array(arrayBuffer);
      self.userService.updatePortrait(self.user, array, (data) => {
        console.log("profile component received portrait data:");
        console.log(data);
      });
    }
    reader.readAsArrayBuffer(file);
  }

  selectGender() {
    console.log("select gender pressed");
    let popover = this.popoverCtrl.create('Dropdown', {
      items: ['Male', 'Female']
    });
    popover.onDidDismiss(data => {
      if (data) {
        if (data == 'Male') {
          this.user.male = true;
        } else {
          this.user.male = false;
        }
      }
    });
    popover.present();
  }

  savePressed() {
    const self = this;
    console.log("save pressed");
    this.userService.updateUser(this.user, this.oldPassword, this.newPassword1 ,this.newPassword2)
    .then(data => {
      console.log("profile component received data:");
      console.log(data);
      self.editing = false;
    });
  }

}
