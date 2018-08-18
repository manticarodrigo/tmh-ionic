import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

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
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private userService: UserService,
    private projectService: ProjectService
  ) {
    this.userService.fetchCurrentUser()
      .subscribe(user => {
        this.user = user;
        this.loadProjects();
      });
  }

  homePressed() {
    let alert = this.alertCtrl.create({
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
    var tabs = [];
    for (let key in this.tabsMap) {
      const tab = this.tabsMap[key];
      tabs.push(tab);
    }
    let popover = this.popoverCtrl.create(
      'dropdown',
      { items: tabs },
      { cssClass: 'tab-popover'
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.selectedTab = data.replace(" ", "_");
        this.loadProjects();
      }
    });
    popover.present();
  }

  loadProjects() {
    const self = this;
    if (this.viewMode == 'CLIENT') {
      self.fetchClientProjects()
      .then(data => {
        self.processProjects(data);
      });
    }
    if (this.viewMode == "DESIGNER") {
      console.log("no designer project assigment logic yet");
    }
    if (this.viewMode == "ADMIN") {
      self.fetchProjects()
      .then(data => {
        self.processProjects(data);
      });
    }
  }

  fetchClientProjects() {
    return new Promise((resolve, reject) => {
      this.projectService.fetchUserProjects()
        .then(data => {
          if (this.selectedTab == 'IN_PROGRESS') {
            var projects = [];
            for (var key in data) {
              const project = data[key];
              const status = project.status;
              if (status != 'ARCHIVED') {
                projects.push(project);
              }
            }
            resolve(projects);
        }
        if (this.selectedTab == 'COMPLETED') {
          var projects = [];
          for (var key in data) {
            const project = data[key];
            const status = project.status;
            if (status == 'ARCHIVED') {
              projects.push(project);
            }
          }
          resolve(projects);
        }
      });
    });
  }

  // TODO: implement designer project assignment in mongodb/express
  // fetchDesignerProjects() {
  //  return this.projectService.findByDesignerId(this.userService.currentUser.userId);


  fetchProjects() {
    if (this.selectedTab == 'IN_PROGRESS')
      return this.projectService.findByInProgress();
    if (this.selectedTab == 'COMPLETED')
      return this.projectService.findByComplete();
    if (this.selectedTab == 'UP_NEXT')
      return this.projectService.findByUpNext();
    if (this.selectedTab == 'ARCHIVED')
      return this.projectService.findByArchived();
  }

  processProjects(data) {
    const self = this;
    var projects = [];
    for (var key in data) {
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
    var todate = new Date(timestamp).getDate();
    var tomonth = new Date(timestamp).getMonth() + 1;
    var toyear = new Date(timestamp).getFullYear();
    var shortyear = toyear.toString().slice(2);
    return `${tomonth}/${todate}/${shortyear}`;
  }

  getDaysLeftStringFrom(timestamp) {
    if (timestamp) {
      let date = new Date(timestamp);
      date.setDate(date.getDate());
      let now = new Date();
      var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      var interval = Math.floor(seconds / 86400); // days
      var abs = Math.abs(interval);
      if (interval <= 0 && abs >= 0 && abs < 15)
        return abs;
      return 'N/A';
    } else {
      return 'N/A';
    }
  }

  startProject() {
    console.log("Start proj pressed");
    this.navCtrl.setRoot('onboarding');
  }

  selectedProject(project) {
    var page: any;
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
