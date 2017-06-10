webpackJsonp([11],{

/***/ 334:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard__ = __webpack_require__(349);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardPageModule", function() { return DashboardPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var DashboardPageModule = (function () {
    function DashboardPageModule() {
    }
    return DashboardPageModule;
}());
DashboardPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__dashboard__["a" /* DashboardPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__dashboard__["a" /* DashboardPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__dashboard__["a" /* DashboardPage */]
        ]
    })
], DashboardPageModule);

//# sourceMappingURL=dashboard.module.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_project_service__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DashboardPage = (function () {
    function DashboardPage(navCtrl, navParams, alertCtrl, popoverCtrl, modalCtrl, platform, userService, projectService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.modalCtrl = modalCtrl;
        this.platform = platform;
        this.userService = userService;
        this.projectService = projectService;
        this.viewMode = 'CLIENT';
        this.selectedTab = 'IN_PROGRESS';
        this.types = {
            BEDROOM: 'Bedroom',
            LIVING_ROOM: 'Living Room',
            MULTIPURPOSE_ROOM: 'Open Layout',
            STUDIO: 'Studio',
            DINING_ROOM: 'Dining Room',
            HOME_OFFICE: 'Office'
        };
        this.phases = {
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
        var self = this;
        this.tabs = ['IN_PROGRESS', 'COMPLETED'];
        this.tabsMap = {
            IN_PROGRESS: 'IN PROGRESS',
            COMPLETED: 'COMPLETED'
        };
        // Fetch current user
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                self.user = user;
                if (self.user.designer) {
                    console.log("current user is a designer");
                    self.viewMode = "DESIGNER";
                }
                if (self.user.admin) {
                    console.log("current user is an admin");
                    self.viewMode = "ADMIN";
                    self.selectedTab = 'IN_PROGRESS';
                    self.tabs = ['IN_PROGRESS', 'UP_NEXT', 'COMPLETED', 'ARCHIVED'];
                    self.tabsMap = {
                        IN_PROGRESS: 'IN PROGRESS',
                        UP_NEXT: 'UP NEXT',
                        COMPLETED: 'COMPLETED',
                        ARCHIVED: 'ARCHIVED',
                    };
                }
                self.loadProjects();
            }
            else {
                self.navCtrl.setRoot('login');
            }
        });
    }
    DashboardPage.prototype.homePressed = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'NEW PROJECT',
            message: 'Press start to begin a new project.',
            buttons: [{
                    text: 'CANCEL',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel pressed');
                    }
                },
                {
                    text: 'START',
                    handler: function (data) {
                        _this.navCtrl.setRoot('onboarding');
                    }
                }]
        });
        alert.present();
    };
    DashboardPage.prototype.selectedTabLink = function (tab) {
        this.selectedTab = tab;
        this.loadProjects();
    };
    DashboardPage.prototype.selectTab = function () {
        var _this = this;
        console.log("Toggling tab dropdown!");
        var tabs = [];
        for (var key in this.tabsMap) {
            var tab = this.tabsMap[key];
            tabs.push(tab);
        }
        var popover = this.popoverCtrl.create('dropdown', {
            items: tabs
        }, {
            cssClass: 'tab-popover'
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                _this.selectedTab = data.replace(" ", "_");
                _this.loadProjects();
            }
        });
        popover.present();
    };
    DashboardPage.prototype.loadProjects = function () {
        var self = this;
        if (this.viewMode == 'CLIENT') {
            self.fetchClientProjects()
                .then(function (data) {
                self.processProjects(data);
            });
        }
        if (this.viewMode == "DESIGNER") {
            console.log("no designer project assigment logic yet");
        }
        if (this.viewMode == "ADMIN") {
            self.fetchProjects()
                .then(function (data) {
                self.processProjects(data);
            });
        }
    };
    DashboardPage.prototype.fetchClientProjects = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            _this.projectService.findByUserId(_this.userService.currentUser.userId)
                .then(function (data) {
                if (_this.selectedTab == 'IN_PROGRESS') {
                    var projects = [];
                    if (!data['exception']) {
                        for (var key in data) {
                            var project = data[key];
                            var status_1 = self.phases[project.projectStatus];
                            if (status_1 != 'ARCHIVED') {
                                projects.push(project);
                            }
                        }
                        resolve(projects);
                    }
                }
                if (_this.selectedTab == 'COMPLETED') {
                    var projects = [];
                    if (!data['exception']) {
                        for (var key in data) {
                            var project = data[key];
                            var status_2 = self.phases[project.projectStatus];
                            if (status_2 == 'ARCHIVED') {
                                projects.push(project);
                            }
                        }
                        resolve(projects);
                    }
                }
            });
        });
    };
    // TODO: implement designer project assignment in mongodb/express
    // fetchDesignerProjects() {
    //  return this.projectService.findByDesignerId(this.userService.currentUser.userId);
    DashboardPage.prototype.fetchProjects = function () {
        if (this.selectedTab == 'IN_PROGRESS')
            return this.projectService.findByInProgress();
        if (this.selectedTab == 'COMPLETED')
            return this.projectService.findByComplete();
        if (this.selectedTab == 'UP_NEXT')
            return this.projectService.findByUpNext();
        if (this.selectedTab == 'ARCHIVED')
            return this.projectService.findByArchived();
    };
    DashboardPage.prototype.processProjects = function (data) {
        var self = this;
        var projects = [];
        if (!data.exception) {
            for (var key in data) {
                var project = data[key];
                project.projectTypeReadable = self.types[project.projectType];
                project.projectStatusReadable = self.phases[project.projectStatus];
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
        }
        else {
            console.log(data.exception);
        }
        if (projects.length > 0) {
            self.projects = projects;
        }
        else {
            self.projects = null;
        }
    };
    DashboardPage.prototype.getDateStringFrom = function (timestamp) {
        var todate = new Date(timestamp).getDate();
        var tomonth = new Date(timestamp).getMonth() + 1;
        var toyear = new Date(timestamp).getFullYear();
        var shortyear = toyear.toString().slice(2);
        return tomonth + '/' + todate + '/' + shortyear;
    };
    DashboardPage.prototype.getDaysLeftStringFrom = function (timestamp) {
        if (timestamp) {
            var date = new Date(timestamp);
            date.setDate(date.getDate());
            var now = new Date();
            var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            var interval = Math.floor(seconds / 86400); // days
            var abs = Math.abs(interval);
            if (interval <= 0 && abs >= 0 && abs < 15)
                return abs;
            return 'N/A';
        }
        else {
            return 'N/A';
        }
    };
    DashboardPage.prototype.startProject = function () {
        console.log("Start proj pressed");
        this.navCtrl.setRoot('onboarding');
    };
    DashboardPage.prototype.selectedProject = function (project) {
        console.log("selected project with status:");
        console.log(project.projectStatus);
        var page;
        if (project.projectStatus == 'DETAILS')
            page = 'details';
        if (project.projectStatus == 'DESIGN')
            page = 'design';
        if (project.projectStatus == 'CONCEPTS')
            page = 'design';
        if (project.projectStatus == 'FLOOR_PLAN')
            page = 'design';
        if (project.projectStatus == 'REQUEST_ALTERNATIVES')
            page = 'design';
        if (project.projectStatus == 'ALTERNATIVES_READY')
            page = 'design';
        if (project.projectStatus == 'FINAL_DELIVERY')
            page = 'final-delivery';
        if (project.projectStatus == 'SHOPPING_CART')
            page = 'final-delivery';
        if (project.projectStatus == 'ESTIMATE_SHIPPING_AND_TAX')
            page = 'final-delivery';
        if (project.projectStatus == 'CHECKOUT')
            page = 'final-delivery';
        if (project.projectStatus == 'ARCHIVED')
            page = 'final-delivery';
        this.navCtrl.setRoot(page, {
            project: project,
            id: project.projectId
        });
    };
    return DashboardPage;
}());
DashboardPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'dashboard'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-dashboard',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/dashboard/dashboard.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:5px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-title>Dashboard</ion-title>\n    <ion-buttons end>\n      <button class="avatar" ion-button  menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <div class="sub-nav">\n    <div class="desktop menu">\n      <div *ngFor="let tab of tabs"><a [class.active]="tab == selectedTab" (click)="selectedTabLink(tab)">{{ tabsMap[tab] }}</a></div>\n    </div>\n    <button class="mobile" ion-button type="button" (click)="selectTab()" full>\n      {{ tabsMap[selectedTab] }}\n      <img src="assets/down.png">\n    </button>\n  </div>\n</ion-header>\n\n<ion-content padding>\n\n  <div class="dashboard-header desktop">\n    <div class="section type">\n      <img src="assets/BEDROOM.png">\n    </div>\n    <div class="section">\n      <p class="info">Client Name</p>\n    </div>\n    <div class="section">\n      <p class="info">Project Type</p>\n    </div>\n    <div class="section">\n      <p class="info">Last Edited</p>\n    </div>\n    <div class="section">\n      <p class="info">Status</p>\n    </div>\n    <div class="section">\n      <p class="info">Time Left</p>\n    </div>\n    <div class="section">\n      <p class="info">Messages</p>\n    </div>\n  </div>\n\n  <ion-list>\n\n    <ion-item text-center class="no-projects" *ngIf="tab == \'IN_PROGRESS\' && !projects && viewMode == \'CLIENT\'">\n      <h2>We welcome you<span *ngIf="user">, {{ user.firstName }}</span>.</h2>\n      <p>You have not started a project yet. We encourage you to start a new one.\n      <button ion-button (click)="startProject()" full>START NEW PROJECT</button>\n    </ion-item>\n\n    <ion-item text-center class="no-projects" *ngIf="tab == \'COMPLETED\' && !projects && viewMode == \'CLIENT\'">\n      <h2>Oops.</h2>\n      <p>Looks like you have not finished a project yet. If you haven\'t already, you can start a new project at any time.</p>\n      <button ion-button (click)="startProject()" full>START NEW PROJECT</button>\n    </ion-item>\n\n    <ion-item text-center class="no-projects" *ngIf="!projects && viewMode == \'DESIGNER\'">\n      <h2>HANG TIGHT</h2>\n      <p>We are working hard to connect you with the right clients for you. Check back soon for assigned projects.</p>\n    </ion-item>\n\n    <ion-item class="project" *ngFor="let project of projects" (click)="selectedProject(project)">\n      <div class="mobile">\n        <div class="header">\n          <div class="type" item-left>\n            <img src="assets/{{ project.projectType }}.png">\n          </div>\n          <div class="chat" item-right>\n            <img src="assets/chat.png">\n          </div>\n        </div>\n        <div class="details">\n          <p class="title">\n            <span *ngIf="!project.client">\n              <ion-spinner name="crescent"></ion-spinner>\n            </span>\n            <b>\n            <span *ngIf="project.client">\n              {{ project.client.shortName }}\n            </span>\n             - {{ project.projectTypeReadable }} Project\n            </b>\n          </p>\n          <div class="section">\n            <p class="info">{{ project.modifiedDateReadable }}</p>\n            <p class="sub-title">Edited</p>\n          </div>\n          <div class="section">\n            <p class="info">{{ project.projectStatusReadable }}</p>\n            <p class="sub-title">Phase</p>\n          </div>\n          <div class="section">\n            <p class="info">{{ project.endDateReadable }}</p>\n            <p class="sub-title">Days Left</p>\n          </div>\n        </div>\n      </div>\n      <div class="desktop">\n        <div class="section type">\n          <img src="assets/{{ project.projectType }}.png">\n        </div>\n        <div class="section">\n          <ion-spinner *ngIf="!project.client" name="crescent"></ion-spinner>\n          <p class="info" *ngIf="project.client">{{ project.client.shortName }}</p>\n        </div>\n        <div class="section">\n          <p class="info">{{ project.projectTypeReadable }}</p>\n        </div>\n        <div class="section">\n          <p class="info">{{ project.modifiedDateReadable }}</p>\n        </div>\n        <div class="section">\n          <p class="info">{{ project.projectStatusReadable }}</p>\n        </div>\n        <div class="section">\n          <p class="info">{{ project.endDateReadable }}</p>\n        </div>\n        <div class="section chat">\n          <img src="assets/chat.png">\n        </div>\n      </div>\n    </ion-item>\n  \n  </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/dashboard/dashboard.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* PopoverController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_project_service__["a" /* ProjectService */]])
], DashboardPage);

//# sourceMappingURL=dashboard.js.map

/***/ })

});
//# sourceMappingURL=11.main.js.map