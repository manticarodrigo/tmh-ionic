webpackJsonp([8],{

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__final_delivery__ = __webpack_require__(356);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FinalDeliveryPageModule", function() { return FinalDeliveryPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var FinalDeliveryPageModule = (function () {
    function FinalDeliveryPageModule() {
    }
    return FinalDeliveryPageModule;
}());
FinalDeliveryPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__final_delivery__["a" /* FinalDeliveryPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__final_delivery__["a" /* FinalDeliveryPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__final_delivery__["a" /* FinalDeliveryPage */]
        ]
    })
], FinalDeliveryPageModule);

//# sourceMappingURL=final-delivery.module.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_project_service__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_image_service__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FinalDeliveryPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FinalDeliveryPage = (function () {
    function FinalDeliveryPage(navCtrl, navParams, userService, projectService, imageService, alertCtrl, popoverCtrl, modalCtrl, platform) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.projectService = projectService;
        this.imageService = imageService;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.modalCtrl = modalCtrl;
        this.platform = platform;
        // Step flow
        this.types = {
            BEDROOM: 'Bedroom',
            LIVING_ROOM: 'Living Room',
            MULTIPURPOSE_ROOM: 'Multipurpose Room',
            STUDIO: 'Studio',
            DINING_ROOM: 'Dining Room',
            HOME_OFFICE: 'Office'
        };
        this.status = {
            UPLOADED_DRAWING: false,
            UPLOADED_INSPIRATION: false,
            UPLOADED_FURNITURE: false
        };
        this.view = 'DESIGNER_NOTE';
        this.viewMode = 'CLIENT';
        this.designerNote = '';
        this.videoUrl = '';
        this.finalNote = '';
        var self = this;
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                self.user = user;
                if (self.user.designer) {
                    self.viewMode = "DESIGNER";
                }
                if (self.user.admin) {
                    self.viewMode = "DESIGNER";
                }
                self.fetchProject();
            }
            else {
                self.navCtrl.setRoot('login');
            }
        });
    }
    FinalDeliveryPage.prototype.fetchProject = function () {
        var self = this;
        if (this.navParams.get('project')) {
            self.project = this.navParams.get('project');
            if (self.project && self.project.designerNote != '') {
                self.designerNote = this.project.designerNote;
            }
            self.fetchDetails();
        }
        else if (this.navParams.get('id')) {
            var id = self.navParams.get('id');
            self.projectService.findByProjectId(id)
                .then(function (project) {
                if (!project['exception']) {
                    self.project = project;
                    if (self.project && self.project.designerNote != '') {
                        self.designerNote = self.project.designerNote;
                    }
                    self.fetchDetails();
                }
            });
        }
    };
    FinalDeliveryPage.prototype.fetchDetails = function () {
        var self = this;
        console.log("fetching project details");
        this.projectService.fetchProjectDetail(this.project.projectId, "CONCEPT")
            .then(function (data) {
            console.log("design page received concepts and floorplan:");
            console.log(data);
            if (!data['exception']) {
                for (var key in data) {
                    var detail = data[key];
                    if (detail && detail.projectDetailStatus == 'APPROVED') {
                        detail.url = self.imageService.createFileUrl(detail.file);
                        self.conceptboard = detail;
                    }
                }
            }
        });
        this.projectService.fetchProjectDetail(this.project.projectId, "FLOOR_PLAN")
            .then(function (data) {
            console.log("design page received concepts and floorplan:");
            console.log(data);
            if (!data['exception']) {
                for (var key in data) {
                    var detail = data[key];
                    if (detail && detail.projectDetailStatus == 'APPROVED') {
                        detail.url = self.imageService.createFileUrl(detail.file);
                        self.floorplan = detail;
                    }
                }
            }
        });
        this.projectService.fetchProjectDetail(this.project.projectId, "FINAL_SNAPSHOTS")
            .then(function (data) {
            console.log("details page received final snapshots:");
            console.log(data);
            if (!data['exception']) {
                var snapshots = [];
                for (var key in data) {
                    var detail = data[key];
                    detail.url = self.imageService.createFileUrl(detail.file);
                    snapshots.push(detail);
                }
                if (snapshots.length > 0) {
                    self.snapshots = detail;
                }
            }
        });
    };
    FinalDeliveryPage.prototype.stringForView = function (view) {
        return view.replace("_", " ");
    };
    FinalDeliveryPage.prototype.homePressed = function () {
        console.log("logo pressed");
        this.navCtrl.setRoot('dashboard');
    };
    FinalDeliveryPage.prototype.selectTab = function () {
        var _this = this;
        var self = this;
        console.log("toggling tab dropdown");
        var popover = this.popoverCtrl.create('DropdownPage', {
            items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                var page;
                if (data == 'DETAILS')
                    page = 'details';
                if (data == 'DESIGN')
                    page = 'design';
                if (page)
                    _this.navCtrl.setRoot(page, {
                        project: self.project,
                        id: self.project.projectId
                    });
            }
        });
        popover.present();
    };
    FinalDeliveryPage.prototype.selectTabLink = function (link) {
        var self = this;
        console.log("selected tab link:");
        console.log(link);
        var page;
        if (link == 'DETAILS')
            page = 'details';
        if (link == 'DESIGN')
            page = 'design';
        if (page)
            this.navCtrl.setRoot(page, {
                project: self.project,
                id: self.project.projectId
            });
    };
    FinalDeliveryPage.prototype.selectFooterTab = function () {
        var self = this;
        console.log("toggling tab dropdown");
        var popover = this.popoverCtrl.create('Dropdown', {
            items: ['DESIGNER NOTE', 'FLOOR PLAN', 'CONCEPT BOARD', '3D MODEL', 'SNAPSHOTS', 'FINAL NOTES', 'SHOPPING CART']
        }, {
            cssClass: 'tab-popover'
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                if (data == 'SHOPPING CART') {
                    console.log("selected footer tab shopping cart");
                }
                else {
                    self.view = data.replace(" ", "_");
                }
            }
        });
        popover.present();
    };
    FinalDeliveryPage.prototype.selectFooterTabLink = function (link) {
        var self = this;
        console.log("selected footer tab link:");
        console.log(link);
        if (link == 'SHOPPING_CART') {
            console.log("selected footer tab shopping cart");
            this.navCtrl.setRoot('shopping-cart', {
                project: self.project,
                id: self.project.projectId
            });
        }
        else {
            this.view = link;
        }
    };
    return FinalDeliveryPage;
}());
FinalDeliveryPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])({
        name: 'final-delivery',
        segment: 'final-delivery/:id'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-final-delivery',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/final-delivery/final-delivery.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:5px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-title><span *ngIf="project">{{ project.client.firstName }}\'s </span><span *ngIf="project">{{ types[project.projectType] }} Project: </span><span class="page">Design Studio</span></ion-title>\n    <ion-buttons end>\n      <button class="avatar" ion-button menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <div class="sub-nav">\n    <div class="desktop menu">\n      <div><a (click)="selectTabLink(\'DETAILS\')">1. DETAILS</a></div>\n      <div><a (click)="selectTabLink(\'DESIGN\')">2. DESIGN</a></div>\n      <div><a class="active">3. FINAL DELIVERY</a></div>\n    </div>\n    <button class="mobile" ion-button type="button" (click)="selectTab()" full>\n      3. FINAL DELIVERY\n      <img src="assets/down.png">\n    </button>\n  </div>\n</ion-header>\n\n<ion-content>\n  <div class="collab-final-delivery" *ngIf="project">\n    <ion-segment *ngIf="user.admin && project.projectStatus == \'SHOPPING_CART\' || project.projectStatus == \'ESTIMATE_SHIPPING_AND_TAX\' || project.projectStatus == \'ARCHIVED\'" [(ngModel)]="viewMode" class="admin-segment">\n      <ion-segment-button value="CLIENT">\n        CLIENT\n      </ion-segment-button>\n      <ion-segment-button value="DESIGNER">\n        DESIGNER\n      </ion-segment-button>\n    </ion-segment>\n    <button class="chat-fab mobile" ion-fab (click)="maximizeChat()">\n      <img src="assets/chats.png">\n    </button>\n    <div *ngIf="view == \'DESIGNER_NOTE\' && viewMode == \'CLIENT\'" class="designer-note">\n      <h4 *ngIf="client">Hi {{ client.firstName }}!</h4>\n      <p *ngIf="project.designerNote != \'\'">{{ project.designerNote }}</p>\n      <p *ngIf="project.designerNote == \'\'">Your designer is hard at work putting together the Final Delivery of your room! It will be uploaded within the next 48-72 hours!</p>\n    </div>\n    <div *ngIf="view == \'DESIGNER_NOTE\' && viewMode == \'DESIGNER\'" class="designer-note">\n      <h6>Leave a kind note for your client.</h6>\n      <ion-textarea [(ngModel)]="designerNote" name="designer-note"></ion-textarea>\n      <button ion-button type="button" (click)="saveDesignerNote()">SAVE</button>\n    </div>\n    <div *ngIf="view == \'FLOOR_PLAN\' && viewMode == \'CLIENT\'" class="collab-image">\n      <img class="selected-img" [src]="floorplan.url">\n    </div>\n    <div *ngIf="view == \'FLOOR_PLAN\' && floorplan && viewMode == \'DESIGNER\'" class="collab-image">\n      <img class="selected-img" [src]="floorplan.url">\n      <button ion-button type="button" (click)="uploadFloorPlan()">UPLOAD NEW</button>\n    </div>\n    <div *ngIf="view == \'FLOOR_PLAN\' && !floorplan && viewMode == \'DESIGNER\'" class="collab-alert">\n      <h1>UPLOAD FINAL FLOOR PLAN</h1>\n      <p>Send your client a final image of their Floor Plan.</p>\n      <button ion-button type="button" (click)="uploadFloorPlan()">UPLOAD</button>\n    </div>\n    <div *ngIf="view == \'CONCEPT_BOARD\' && viewMode == \'CLIENT\'" class="collab-image">\n      <img class="selected-img" [src]="conceptboard.url">\n    </div>\n    <div *ngIf="view == \'CONCEPT_BOARD\' && conceptboard && viewMode == \'DESIGNER\'" class="collab-image">\n      <img class="selected-img" [src]="conceptboard.url">\n      <button ion-button type="button" (click)="uploadConceptBoard()">UPLOAD NEW</button>\n    </div>\n    <div *ngIf="view == \'CONCEPT_BOARD\' && !conceptboard && viewMode == \'DESIGNER\'" class="collab-alert">\n      <h1>UPLOAD FINAL CONCEPT BOARD</h1>\n      <p>Send your client a final image of their Concept Board.</p>\n      <button ion-button type="button" (click)="uploadConceptBoard()">UPLOAD</button>\n    </div>\n    <div *ngIf="view == \'3D_MODEL\' && viewMode == \'CLIENT\'" class="final-video">\n      <video *ngIf="project.videoUrl != \'\'" controls><source src="{{ project.videoUrl }}"></video>\n    </div>\n    <div *ngIf="view == \'3D_MODEL\' && viewMode == \'DESIGNER\'" class="final-video">\n      <video *ngIf="project.videoUrl != \'\'" controls><source src="{{ project.videoUrl }}"></video>\n      <div class="form">\n        <h1>Link Final 3D Model Video</h1>\n        <ion-input [(ngModel)]="videoUrl" name="video-url" placeholder="PASTE LINK HERE"></ion-input>\n        <button ion-button type="button" (click)="saveVideoUrl()">SAVE</button>\n      </div>\n    </div>\n    <div *ngIf="view == \'SNAPSHOTS\' && viewMode == \'CLIENT\'" class="snapshots">\n      <ion-slides class="mobile">\n        <ion-slide *ngFor="let snapshot of snapshots" autoplay="2000">\n          <img [src]="snapshot.url">\n        </ion-slide>\n      </ion-slides>\n      <ion-slides class="desktop" slidesPerView="3" spaceBetween="20" autoplay="2000">\n        <ion-slide *ngFor="let snapshot of snapshots">\n          <img [src]="snapshot.url">\n        </ion-slide>\n      </ion-slides>\n    </div>\n    <div *ngIf="view == \'SNAPSHOTS\' && viewMode == \'DESIGNER\'" class="snapshots">\n      <ion-slides class="mobile">\n        <ion-slide *ngFor="let snapshot of snapshots" autoplay="2000">\n          <img [src]="snapshot.url">\n        </ion-slide>\n      </ion-slides>\n      <ion-slides class="desktop" slidesPerView="3" spaceBetween="20" autoplay="2000">\n        <ion-slide *ngFor="let snapshot of snapshots">\n          <img [src]="snapshot.url">\n        </ion-slide>\n      </ion-slides>\n      <div class="collab-alert">\n        <h1>UPLOAD FINAL SNAPSHOTS</h1>\n        <p class="note">( 6 Picture Limit)</p>\n        <button (click)="uploadSnapshot()" ion-button full type="button">UPLOAD</button>\n      </div>\n    </div>\n    <div *ngIf="view == \'FINAL_NOTES\' && viewMode == \'CLIENT\'" class="designer-note">\n      <h1>FINAL NOTES</h1>\n      <p *ngIf="project.finalNote != \'\'">{{ project.finalNote }}</p>\n    </div>\n    <div *ngIf="view == \'FINAL_NOTES\' && viewMode == \'DESIGNER\'" class="designer-note">\n      <h6>Leave detailed notes about the design.</h6>\n      <ion-textarea [(ngModel)]="finalNote" name="final-note"></ion-textarea>\n      <button ion-button type="button" (click)="saveFinalNote()">SAVE</button>\n    </div>\n  </div>\n</ion-content>\n\n<ion-footer *ngIf="project">\n  <div class="footer" *ngIf="viewMode == \'CLIENT\' && project.projectStatus == \'SHOPPING_CART\' || project.projectStatus == \'ESTIMATE_SHIPPING_AND_TAX\' || project.projectStatus == \'ARCHIVED\'">\n    <div class="desktop footer-menu">\n      <div class="button" (click)="selectFooterTabLink(\'DESIGNER_NOTE\')">\n        <img src="assets/list.png">\n        Designer Note\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'FLOOR_PLAN\')">\n        <img src="assets/floor-plan.png">\n        Floor Plan\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'CONCEPT_BOARD\')">\n        <img src="assets/concept.png">\n        Concept Board\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'3D_MODEL\')">\n        <img src="assets/3d-model.png">\n        3D Model\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'SNAPSHOTS\')">\n        <img src="assets/snapshot.png">\n        Snapshots\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'FINAL_NOTES\')">\n        <img src="assets/note.png">\n        Final Notes\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'SHOPPING_CART\')">\n        <img src="assets/cart.png">\n        Shopping Cart\n      </div>\n    </div>\n    <button class="mobile footer-dropdown" ion-button type="button" (click)="selectFooterTab()" full>\n      {{ stringForView(this.view) }}\n      <img src="assets/down.png">\n    </button>\n  </div>\n  <div class="footer" *ngIf="viewMode == \'DESIGNER\'">\n    <div class="desktop footer-menu">\n      <div class="button" (click)="selectFooterTabLink(\'DESIGNER_NOTE\')">\n        <img src="assets/list.png">\n        Designer Note\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'FLOOR_PLAN\')">\n        <img src="assets/floor-plan.png">\n        Floor Plan\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'CONCEPT_BOARD\')">\n        <img src="assets/concept.png">\n        Concept Board\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'3D_MODEL\')">\n        <img src="assets/3d-model.png">\n        3D Model\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'SNAPSHOTS\')">\n        <img src="assets/snapshot.png">\n        Snapshots\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'FINAL_NOTES\')">\n        <img src="assets/note.png">\n        Final Notes\n      </div>\n      <div class="button" (click)="selectFooterTabLink(\'SHOPPING_CART\')">\n        <img src="assets/cart.png">\n        Shopping Cart\n      </div>\n    </div>\n    <button class="mobile footer-dropdown" ion-button type="button" (click)="selectFooterTab()" full>\n      {{ stringForView(this.view) }}\n      <img src="assets/down.png">\n    </button>\n  </div>\n</ion-footer>\n'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/final-delivery/final-delivery.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_project_service__["a" /* ProjectService */],
        __WEBPACK_IMPORTED_MODULE_4__providers_image_service__["a" /* ImageService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* PopoverController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Platform */]])
], FinalDeliveryPage);

//# sourceMappingURL=final-delivery.js.map

/***/ })

});
//# sourceMappingURL=8.main.js.map