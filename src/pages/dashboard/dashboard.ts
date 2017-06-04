import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, ModalController, Platform } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ProjectService } from '../../providers/project-service';

import { DetailsPage } from '../details/details';
import { DesignPage } from '../design/design';
import { FinalDeliveryPage } from '../final-delivery/final-delivery';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  user: any;
  viewMode = 'CLIENT';
  projects: Array<any>;
  tab = 'IN_PROGRESS';
  tabs: any;
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Open Layout',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
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
    ARCHIVED: 'Archived'
  };
  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController,
              private platform: Platform,
              private userService: UserService,
              private projectService: ProjectService) {
    this.user = this.userService.currentUser;
    this.tabs = {
      IN_PROGRESS: 'IN PROGRESS',
      COMPLETED: 'COMPLETED',
    };
    if (this.userService.currentUser.designer) {
      console.log("current user is a designer");
      this.viewMode = "DESIGNER";
    }
    if (this.user.admin) {
      console.log("current user is an admin");
      this.viewMode = "ADMIN";
      this.tab = 'IN_PROGRESS';
      this.tabs = {
        IN_PROGRESS: 'IN PROGRESS',
        UP_NEXT: 'UP NEXT',
        COMPLETED: 'COMPLETED',
        ARCHIVED: 'ARCHIVED',
        
      };
    }
    this.loadProjects();
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
          this.navCtrl.setRoot('OnboardingPage')
        }
      }]
    });
    alert.present();
  }

  selectedTabLink(tab) {
    this.tab = tab;
    this.loadProjects();
  }

  selectTab() {
    console.log("Toggling tab dropdown!");
    var tabs = [];
    for (var key in this.tabs) {
      console.log(key);
      const tab = this.tabs[key];
      console.log(tab);
      tabs.push(tab);
    }
    let popover = this.popoverCtrl.create('Dropdown', {
      items: tabs
    }, 
    {
      cssClass: 'tab-popover'
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.tab = data.replace(" ", "_");
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
    const self = this;
    return new Promise((resolve, reject) => {
      this.projectService.findByUserId(this.userService.currentUser.userId)
      .then(data => {
        if (this.tab == 'IN_PROGRESS') {
          var projects = [];
          if (!data['exception']) {
            for (var key in data) {
              const project = data[key];
              const status = self.phases[project.projectStatus];
              if (status != 'ARCHIVED') {
                projects.push(project);
              }
            }
            resolve(projects);
          }
        }
        if (this.tab == 'COMPLETED') {
          var projects = [];
          if (!data['exception']) {
            for (var key in data) {
              const project = data[key];
              const status = self.phases[project.projectStatus];
              if (status == 'ARCHIVED') {
                projects.push(project);
              }
            }
            resolve(projects);
          }
        }
      });
    });
  }

  // TODO: implement designer project assignment in mongodb/express
  // fetchDesignerProjects() {
  //  return this.projectService.findByDesignerId(this.userService.currentUser.userId);


  fetchProjects() {
    if (this.tab == 'IN_PROGRESS')
      return this.projectService.findByInProgress();
    if (this.tab == 'COMPLETED')
      return this.projectService.findByComplete();
    if (this.tab == 'UP_NEXT')
      return this.projectService.findByUpNext();
    if (this.tab == 'ARCHIVED')
      return this.projectService.findByArchived();
  }

  processProjects(data) {
    const self = this;
    var projects = [];
    if (!data.exception) {
      for (var key in data) {
        const project = data[key];
        project.projectTypeReadable = self.types[project.projectType]
        project.projectStatusReadable = self.phases[project.projectStatus]
        project.modifiedDateReadable = self.getDateStringFrom(project.modifiedDate);
        project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
        if (project.client) {
          project.client.shortName = project.client.firstName;
          if (project.client.lastName) {
            project.client.shortName += ' ' + project.client.lastName.split('')[0] + '.';
          }
        }
        projects.push(project);
      }
    } else {
      console.log(data.exception);
    }

    if (projects.length > 0) {
      self.projects = projects;
    } else {
      self.projects = null;
    }
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
      if (interval > 0 && interval < 15)
        return interval;
      return 0;
    } else {
      return 'N/A';
    }
  }

  startProject() {
    console.log("Start proj pressed");
    this.navCtrl.setRoot('OnboardingPage');
  }

  selectedProject(project) {
    console.log("selected project with status:");
    console.log(project.projectStatus);
    var page: any;
    if (project.projectStatus == 'DETAILS')
      page = DetailsPage;
    if (project.projectStatus == 'DESIGN')
      page = DesignPage;
    if (project.projectStatus == 'CONCEPTS')
      page = DesignPage;
    if (project.projectStatus == 'FLOOR_PLAN')
      page = DesignPage;
    if (project.projectStatus == 'REQUEST_ALTERNATIVES')
      page = DesignPage;
    if (project.projectStatus == 'ALTERNATIVES_READY')
      page = DesignPage;
    if (project.projectStatus == 'FINAL_DELIVERY')
      page = FinalDeliveryPage;
    if (project.projectStatus == 'SHOPPING_CART')
      page = FinalDeliveryPage;
    if (project.projectStatus == 'ESTIMATE_SHIPPING_AND_TAX')
      page = FinalDeliveryPage;
    if (project.projectStatus == 'ARCHIVED')
      page = FinalDeliveryPage;
    this.navCtrl.setRoot(page, {
      project: project
    });
  }

}
