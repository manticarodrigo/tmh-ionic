import { Component } from '@angular/core';

import {
  IonicPage,
  NavController,
  AlertController,
  PopoverController
} from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

@IonicPage({
  name: 'dashboard'
})
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  user: any;
  viewMode = 'CLIENT';
  projects: Array<any>;
  selectedTab = 'IN_PROGRESS';
  tabs: ['IN_PROGRESS', 'COMPLETED'];
  tabsMap = {
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED'
  };
  phases = {
    DETAILS: 'Details',
    DESIGN: 'Design',
    CONCEPTS: 'Concepts',
    FLOOR_PLAN: 'Floor Plan',
    REQUEST_ALTERNATIVES: 'Request Alternatives',
    ALTERNATIVES_READY: 'Alternatives Ready',
    FINAL_DELIVERY: 'Final Delivery',
    SHOPPING_CART: 'Shopping Cart',
    ESTIMATE_SHIPPING_AND_TAX: 'Estimate Shipping & Tax',
    CHECKOUT: 'Checkout',
    ARCHIVED: 'Archived'
  };
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        if (user) {
          this.user = user;
          if (this.user.is_staff) {
            this.viewMode = 'DESIGNER';
          }
          this.loadProjects();
        }
      });
  }

  homePressed() {
    const alert = this.alertCtrl.create({
      title: 'NEW PROJECT',
      message: 'Press start to begin a new project.',
      buttons: 
      [{
        text: 'CANCEL',
        role: 'cancel',
        handler: data => {
          console.log('Cancel pressed');
        }
      },
      {
        text: 'START',
        handler: data => {
          this.navCtrl.setRoot('onboarding')
        }
      }]
    });
    alert.present();
  }

  selectedTabLink(tab) {
    this.selectedTab = tab;
    this.loadProjects();
  }

  selectTab() {
    const tabs = [];
    for (let key in this.tabsMap) {
      const tab = this.tabsMap[key];
      tabs.push(tab);
    }
    const popover = this.popoverCtrl.create(
      'dropdown',
      { items: tabs },
      { cssClass: 'tab-popover'
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.selectedTab = data.replace(' ', '_');
        this.loadProjects();
      }
    });
    popover.present();
  }

  loadProjects() {
    if (this.viewMode === 'CLIENT') {
      this.fetchClientProjects()
        .then(data => {
          this.processProjects(data);
        });
    }
    if (this.viewMode === 'DESIGNER') {
      this.fetchProjects()
        .then(data => {
          this.processProjects(data);
        });
    }
  }

  fetchClientProjects() {
    return new Promise((resolve, reject) => {
      this.projectService.fetchUserProjects()
        .then(data => {
          const projects = [];
          for (const key in data) {
            const project = data[key];
            if (
              this.selectedTab === 'IN_PROGRESS' &&
              project.status !== 'ARCHIVED'
            ) {
              projects.push(project);
            } else if (
              this.selectedTab === 'COMPLETED' &&
              project.status === 'ARCHIVED'
            ) {
              projects.push(project);
            }
          }
          resolve(projects);
        });
    });
  }

  fetchProjects() {
    switch (this.selectedTab) {
      case 'IN_PROGRESS':
        return this.projectService.findByInProgress();
      case 'COMPLETED':
        return this.projectService.findByComplete();
      case 'UP_NEXT':
        return this.projectService.findByUpNext();
      case 'ARCHIVED':
        return this.projectService.findByArchived();
      default:
        return this.projectService.findByInProgress();
    };
  }

  processProjects(data) {
    const self = this;
    const projects = [];
    for (const key in data) {
      const project = data[key];
      project.modifiedDateReadable = self.getDateStringFrom(project.modified_date);
      project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
      projects.push(project);
    }

    if (projects.length > 0) {
      self.projects = projects;
    } else {
      self.projects = null;
    }
  }

  getDateStringFrom(timestamp) {
    const todate = new Date(timestamp).getDate();
    const tomonth = new Date(timestamp).getMonth() + 1;
    const toyear = new Date(timestamp).getFullYear();
    const shortyear = toyear.toString().slice(2);
    return `${tomonth}/${todate}/${shortyear}`;
  }

  getDaysLeftStringFrom(timestamp) {
    if (timestamp) {
      const date = new Date(timestamp);
      date.setDate(date.getDate());
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const interval = Math.floor(seconds / 86400); // days
      const abs = Math.abs(interval);
      if (interval <= 0 && abs >= 0 && abs < 15)
        return abs;
      return 'N/A';
    } else {
      return 'N/A';
    }
  }

  startProject() {
    console.log('start project pressed');
    this.navCtrl.setRoot('onboarding');
  }

  selectedProject(project) {
    let page: any;
    switch (project.status) {
      case ('DETAILS'):
        page = 'details'
        break;
      case (
        'DESIGN' ||
        'CONCEPTS' ||
        'FLOOR_PLAN' ||
        'REQUEST_ALTERNATIVES' ||
        'ALTERNATIVES_READY'
      ):
        page = 'design'
        break;
      case (
        'FINAL_DELIVERY' ||
        'SHOPPING_CART' ||
        'ESTIMATE_SHIPPING_AND_TAX' ||
        'CHECKOUT' ||
        'ARCHIVED'
      ):
        page = 'final-delivery'
        break;
      default:
        page = 'details'
    }
    this.navCtrl.setRoot(page, {
      project: project,
      id: project.id
    });
  }

}
