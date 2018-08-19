import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  PopoverController
} from 'ionic-angular';

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
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private userService: UserService
  ) {
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.user.createDateReadable = this.getDateStringFrom(this.user.date_joined);
        }
      });
  }

  homePressed() {
    console.log('logo pressed');
    this.navCtrl.setRoot('dashboard');
  }

  editToggled() {
    console.log('edit toggled');
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
    const stringArr = string.split(' ');
    const month = stringArr[1];
    const day = stringArr[2];
    const year = stringArr[3];
    const dateStr = month + ' ' + day + ', ' + year;
    return dateStr;
  }

  fileChanged(event) {
    const self = this
    const file = event.target.files[0];
    console.log('file changed:', file);
    // update user
  }

  selectGender() {
    console.log('select gender pressed');
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
    console.log('save pressed');
    this.userService.updateUser(this.user)
      .then(data => {
        console.log('profile component received data:', data);
        this.editing = false;
        this.user = data;
        this.userService.setCurrentUser(data)
      });
  }

}
