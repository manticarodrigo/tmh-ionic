import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';

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
  tab = 'IN_PROGRESS';
  tabs = {
    ALL: 'ALL',
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    ARCHIVED: 'ARCHIVED',
    UP_NEXT: 'UP NEXT'
  }
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
              private platform: Platform,
              private userService: UserService,
              private projectService: ProjectService) {
    if (this.userService.currentUser) {
      this.user = this.userService.currentUser;
      // load projects
      this.fetchProjects();
    } else {
      console.log("No current user in dashboard");
    }
  }

  fetchProjects() {
    const methods = {
      ALL: this.projectService.findByUserId,
      IN_PROGRESS: this.projectService.findByInProgress,
      COMPLETED: this.projectService.findByComplete,
      ARCHIVED: this.projectService.findByArchived,
      UP_NEXT: this.projectService.findByUpNext
    }
    const method = methods[this.tab];
    const self = this;
    console.log("fetching projects with method:")
    console.log(method);
    if (this.tab == 'ALL') {
      self.projectService.findByUserId(self.userService.currentUser.userId)
      .then(data => {
        self.processProjects(data);
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      method
      .then(data => {
        if (!data.exception) {
          self.processProjects(data);
        } else {
          console.log(data.exception);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  processProjects(data) {
    const self = this;
    var projects = [];
    for (var key in data) {
      const project = data[key];
      project.projectTypeReadable = self.types[project.projectType]
      project.projectStatusReadable = self.phases[project.projectStatus]
      project.modifiedDateReadable = self.getDateStringFrom(project.modifiedDate);
      project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
      projects.push(project);
    }
    if (projects.length > 0)
      self.projects = projects;
    self.projects = null;
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    let width = this.platform.width();
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '55',
            left: width
          };
        }
      }
    };
    popover.present({ev});
  }

  selectTab() {
    console.log("Toggling tab dropdown!");
    let popover = this.popoverCtrl.create('TabDropdown');
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '325'
          };
        }
      }
    };
    popover.onDidDismiss(data => {
      if (data) {
        this.tab = data.replace(" ", "_");
        this.fetchProjects();
      }
    });
    popover.present({ev});
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
