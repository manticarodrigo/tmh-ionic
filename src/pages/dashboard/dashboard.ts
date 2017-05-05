import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {
  user: any;
  projects: Array<any>;
  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController,
              private userService: UserService,
              private projectService: ProjectService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
      // load projects
    this.projectService.findByUpNext(this.userService.headers, (data) => {
      if (!data.exception) {
        this.projects = data;
      } else {
        console.log(data.exception);
      }
    });
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
