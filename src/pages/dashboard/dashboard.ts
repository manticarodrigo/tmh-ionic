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
export class Dashboard {
  user: any;
  projects: Array<any>;
  projectUsers = {};
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
    DETAILS: 'Details',
    DESIGN: 'Design',
    CONCEPTS: 'Concepts',
    FLOOR_PLAN: 'Floor Plan',
    REQUEST_ALTERNATIVES: 'Request Alternatives',
    FINAL_DELIVERY: 'Final Delivery',
    SHOPPING_CART: 'Shopping Cart',
    ESTIMATE_SHIPPING_AND_TAX: 'Estimate Shipping & Tax',
    ARCHIVED: 'Archived'
  }
  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController,
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

  homePressed() {
    let alert = this.alertCtrl.create({
      title: 'NEW PROJECT',
      message: 'Press start to begin a new project.',
      buttons: 
      [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
              console.log('Cancel pressed');
          }
      },
      {
          text: 'Start',
          handler: data => {
              this.navCtrl.setRoot('Onboarding')
          }
      }]
    });
    alert.present();
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    let width = this.platform.width();
    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '25'
          };
        }
      }
    };
    popover.onDidDismiss(data => {
      if (data == 'PROFILE') {
        this.navCtrl.setRoot('Profile');
      }
      if (data == 'ALL') {
        this.navCtrl.setRoot('Dashboard');
      }
      if (data == 'NEW') {
        this.navCtrl.setRoot('Onboarding');
      }
      if (data == 'LOGOUT') {
        this.userService.logout();
        this.navCtrl.setRoot('Login');
      }
    });
    popover.present({ev});
  }

  selectedTabLink(tab) {
    this.tab = tab;
    this.loadProjects();
  }

  selectTab() {
    console.log("Toggling tab dropdown!");
    let popover = this.popoverCtrl.create('TabDropdown', {
      tabs: ['ALL', 'IN PROGRESS', 'COMPLETED', 'ARCHIVED', 'UP NEXT']
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.tab = data.replace(" ", "_");
        this.loadProjects();
      }
    });
    popover.present();
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
    if (!data.exception) {
      for (var key in data) {
        const project = data[key];
        project.projectTypeReadable = self.types[project.projectType]
        project.projectStatusReadable = self.phases[project.projectStatus]
        project.modifiedDateReadable = self.getDateStringFrom(project.modifiedDate);
        project.endDateReadable = self.getDaysLeftStringFrom(project.endDate);
        projects.push(project);
        self.fetchUser(project.userId);
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

  fetchUser(uid) {
    const self = this;
    self.userService.fetchUser(uid, user => {
      if (user) {
        self.projectUsers[user.userId] = user;
      }
    });
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
    this.navCtrl.setRoot('Onboarding');
  }

  chatFor(project) {
    console.log("Chat pressed for project:");
    console.log(project);
    let modal = this.modalCtrl.create(ChatPage, {
      project: project
    });
    modal.present();
  }

  selectedProject(project) {
    var page: any;
    if (project.projectStatus == 'DETAILS')
      page = DetailsPage;
    if (project.projectStatus == 'DESIGN')
      page = DetailsPage;
    if (project.projectStatus == 'CONCEPTS')
      page = DesignPage;
    if (project.projectStatus == 'FLOOR_PLAN')
      page = DesignPage;
    if (project.projectStatus == 'REQUEST_ALTERNATIVES')
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
