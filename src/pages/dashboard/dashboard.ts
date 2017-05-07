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
    const self = this;
    if (this.userService.currentUser) {
      self.user = self.userService.currentUser;
      self.loadProjects();
    } else {
      console.log("No current user in dashboard");
    }
  }

  fetchProjects() {
    if (this.tab == 'ALL')
      return this.projectService.findByUserId(this.userService.currentUser.userId);
    if (this.tab == 'IN_PROGRESS')
      return this.projectService.findByInProgress();
    if (this.tab == 'COMPLETED')
      return this.projectService.findByComplete();
    if (this.tab == 'UP_NEXT')
      return this.projectService.findByUpNext();
    if (this.tab == 'ARCHIVED')
      return this.projectService.findByArchived();
  }

  loadProjects() {
    const self = this;
    self.fetchProjects()
    .then(data => {
      self.processProjects(data);
    })
    .catch(error => {
      console.log(error);
    })
  }

  processProjects(data) {
    const self = this;
    var projects = [];
    var userIds = [];
    if (!data.exception) {
      for (var key in data) {
        const project = data[key];
        project.projectTypeReadable = self.types[project.projectType]
        project.projectStatusReadable = self.phases[project.projectStatus]
        project.modifiedDateReadable = self.getDateStringFrom(project.modifiedDate);
        project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
        projects.push(project);
        userIds.push(project.userId);
      }
    } else {
      console.log(data.exception);
    }

    if (projects.length > 0) {
      self.projects = projects;
      self.fetchUsers(userIds);
    } else {
      self.projects = null;
    }
  }

  fetchUsers(uids) {
    const self = this;
    return new Promise((resolve, any) => {
      self.userService.fetchUsers(uids)
      .then(users => {
        for (var key in users) {
          const user = users[key];
          if (user) {
            self.projects[key].user = user;
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
    });
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
    popover.onDidDismiss(data => {
      if (data == "LOGOUT") {
        this.userService.logout();
        this.navCtrl.setRoot('Login');
      }
    });
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
        this.loadProjects();
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

  startProject() {
    console.log("Start proj pressed");
  }

}
