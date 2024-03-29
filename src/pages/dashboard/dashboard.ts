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
  isStaff: boolean = false;
  projects: Array<any>;
  selectedTab = 'IN_PROGRESS';

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
            this.isStaff = true;
          }
          this.fetchProjects();
        }
      });
  }

  homePressed() {
    const alert = this.alertCtrl.create({
      title: 'NEW PROJECT',
      message: 'Press start to begin a new project.',
      buttons: [
        {
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
        }
      ]
    });
    alert.present();
  }

  fetchProjects() {
    if (!this.isStaff) {
      this.fetchClientProjects()
        .then((data: Array<any>) => {
          console.log('dashboard received client projects', data);
          this.projects = data;
        });
    }
    if (this.isStaff) {
      this.fetchDesignerProjects()
        .then((data: Array<any>) => {
          console.log('dashboard received designer projects', data);
          this.projects = data;
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

  fetchDesignerProjects() {
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
      case 'DESIGN':
      case 'CONCEPTS':
      case 'FLOOR_PLAN':
      case 'REQUEST_ALTERNATIVES':
      case 'ALTERNATIVES_READY':
        page = 'design'
        break;
      case 'FINAL_DELIVERY':
      case 'SHOPPING_CART':
      case 'ESTIMATE_SHIPPING_AND_TAX':
      case 'CHECKOUT':
      case 'ARCHIVED':
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
