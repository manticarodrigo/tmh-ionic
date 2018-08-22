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
