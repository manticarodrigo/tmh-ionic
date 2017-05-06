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
  tab = 'IN PROGRESS'
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Open Layout',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
  }
  phases = {
    CONCEPTS: 'Concepts',
    DESIGN: 'Design',
    REQUEST_ALTERNATIVES: 'Request Alternatives',
    FLOOR_PLAN: 'Floor Plan',
    FINAL_DELIVERY: 'Final Delivery'
  }
  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController,
              private userService: UserService,
              private projectService: ProjectService) {
    const self = this;
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
      // load projects
    this.projectService.findByInProgress(this.userService.headers, (data) => {
      if (!data.exception) {
        var projects = [];
        for (var key in data) {
          const project = data[key];
          project.projectTypeReadable = self.types[project.projectType]
          project.projectStatusReadable = self.phases[project.projectStatus]
          project.modifiedDateReadable = self.getDateStringFrom(project.modifiedDate);
          project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
          projects.push(project);
        }
        self.projects = projects;
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

  selectTab() {
    console.log("Toggling tab dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    popover.present();
  }

  getDateStringFrom(timestamp) {
    var todate=new Date(timestamp).getDate();
    var tomonth=new Date(timestamp).getMonth()+1;
    var toyear=new Date(timestamp).getFullYear();
    var shortyear = toyear.toString().slice(2);
    return tomonth+'/'+todate+'/'+shortyear;
  }

  getDaysLeftStringFrom(timestamp) {
    if (timestamp) {
      let date = new Date(timestamp);
      date.setDate(date.getDate());
      let now = new Date();
      var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      var interval = Math.floor(seconds / 86400); // days
      if (interval > 0)
        return interval;
      return 0;
    } else {
      return 'N/A';
    }
  }

}
