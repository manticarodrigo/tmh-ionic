webpackJsonp([3],{

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile__ = __webpack_require__(361);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfilePageModule", function() { return ProfilePageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ProfilePageModule = (function () {
    function ProfilePageModule() {
    }
    return ProfilePageModule;
}());
ProfilePageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__profile__["a" /* ProfilePage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__profile__["a" /* ProfilePage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__profile__["a" /* ProfilePage */]
        ]
    })
], ProfilePageModule);

//# sourceMappingURL=profile.module.js.map

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProfilePage = (function () {
    function ProfilePage(navCtrl, navParams, popoverCtrl, platform, userService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.platform = platform;
        this.userService = userService;
        this.editing = false;
        this.oldPassword = '';
        this.newPassword1 = '';
        this.newPassword2 = '';
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                _this.user = user;
                _this.user.createDateReadable = _this.getDateStringFrom(_this.user.createDate);
            }
            else {
                _this.navCtrl.setRoot('login');
            }
        });
    }
    ProfilePage.prototype.homePressed = function () {
        console.log("logo pressed");
        this.navCtrl.setRoot('dashboard');
    };
    ProfilePage.prototype.editToggled = function () {
        console.log("edit toggled");
        if (this.editing) {
            this.savePressed();
        }
        else {
            this.editing = !this.editing;
        }
    };
    ProfilePage.prototype.getDateStringFrom = function (timestamp) {
        var date = new Date(timestamp);
        date.setDate(date.getDate());
        var string = date.toDateString();
        var stringArr = string.split(" ");
        var month = stringArr[1];
        var day = stringArr[2];
        var year = stringArr[3];
        var dateStr = month + ' ' + day + ', ' + year;
        return dateStr;
        ;
    };
    ProfilePage.prototype.fileChanged = function (event) {
        var self = this;
        console.log("file changed:");
        var file = event.target.files[0];
        console.log(file);
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = this.result, array = new Uint8Array(arrayBuffer);
            self.userService.updatePortrait(self.user, array, function (data) {
                console.log("profile component received portrait data:");
                console.log(data);
            });
        };
        reader.readAsArrayBuffer(file);
    };
    ProfilePage.prototype.selectGender = function () {
        var _this = this;
        console.log("select gender pressed");
        var popover = this.popoverCtrl.create('Dropdown', {
            items: ['Male', 'Female']
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                if (data == 'Male') {
                    _this.user.male = true;
                }
                else {
                    _this.user.male = false;
                }
            }
        });
        popover.present();
    };
    ProfilePage.prototype.savePressed = function () {
        var self = this;
        console.log("save pressed");
        this.userService.updateUser(this.user)
            .then(function (data) {
            console.log("profile component received data:");
            console.log(data);
            self.editing = false;
            if (!data['exception']) {
                self.user = data;
                self.userService.setCurrentUser(data);
            }
        });
    };
    return ProfilePage;
}());
ProfilePage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'profile'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-profile',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/profile/profile.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:5px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-title>User Profile</ion-title>\n    <ion-buttons end>\n      <button class="avatar" ion-button menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content text-center>\n  <div class="profile-header">\n    <input class="img-input" *ngIf="editing" type="file" accept="image/*" #file (change)="fileChanged($event)" />\n    <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n    <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n    <button ion-button type="button" (click)="editToggled()">{{ editing ? \'SAVE\' : \'EDIT\' }}</button>\n    <h1 *ngIf="user">{{ user.firstName }} {{ user.lastName }}</h1>\n    <h1 *ngIf="!user">Unknown User</h1>\n    <h3 *ngIf="user && user.city && user.state">{{ user.city }}, {{ user.state }}</h3>\n    <!--<h3 *ngIf="!user || !user.city || !user.state">City, State</h3>-->\n    <h4 *ngIf="user && user.emailAddress">{{ user.emailAddress }}</h4>\n    <h4 *ngIf="!user || !user.emailAddress">email@email.com</h4>\n    <h4 *ngIf="user && user.createDateReadable">Joined: {{ user.createDateReadable }}</h4>\n    <h4 *ngIf="!user || !user.createDateReadable">Joined: January 17, 2017</h4>\n  </div>\n  <div class="profile-wrapper">\n    <div *ngIf="user" class="profile-details">\n      <h1>Personal Information</h1>\n      <div *ngIf="!editing" class="profile-details-content">\n        <h2>NAME</h2>\n        <p>{{ user.firstName }} {{ user.lastName }}</p>\n        <h2>EMAIL</h2>\n        <p>{{ user.emailAddress }}</p>\n        <h2 *ngIf="user.city && user.state">LOCATION</h2>\n        <p *ngIf="user.city && user.state">{{ user.city }}, {{ user.state }}</p>\n        <h2 *ngIf="user.male">GENDER</h2>\n        <p *ngIf="user.male">{{ user.male ? \'Male\' : \'Female\' }}</p>\n      </div>\n      <div *ngIf="editing" class="profile-details-edit">\n        <ion-item>\n          <ion-label stacked>First Name</ion-label>\n          <ion-input [(ngModel)]="user.firstName" placeholder="FIRST NAME"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>Last Name</ion-label>\n          <ion-input [(ngModel)]="user.lastName" placeholder="LAST NAME"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>City</ion-label>\n          <ion-input [(ngModel)]="user.city" disabled placeholder="CITY"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>State</ion-label>\n          <ion-input [(ngModel)]="user.state" disabled placeholder="STATE"></ion-input>\n        </ion-item>\n        <ion-item class="gender-item">\n          <p>Gender</p>\n          <button full ion-button type="button" (click)="selectGender()">\n            {{ user.male ? \'Male\' : \'Female\'}}\n            <img src="assets/down-arrow.png">\n          </button>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>Email</ion-label>\n          <ion-input [(ngModel)]="user.emailAddress" placeholder="EMAIL"></ion-input>\n        </ion-item>\n        <h1>Change Password</h1>\n        <ion-item>\n          <ion-label stacked>Old Password</ion-label>\n          <ion-input [(ngModel)]="oldPassword" placeholder="OLD PASSWORD"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>New Password</ion-label>\n          <ion-input [(ngModel)]="newPassword1" placeholder="NEW PASSWORD"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>Enter Again</ion-label>\n          <ion-input [(ngModel)]="newPassword2" placeholder="VERIFY NEW PASSWORD"></ion-input>\n        </ion-item>\n        <button ion-button type="button" (click)="savePressed()">SAVE</button>\n      </div>\n    </div>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/profile/profile.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* PopoverController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* PopoverController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */]) === "function" && _e || Object])
], ProfilePage);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=profile.js.map

/***/ })

});
//# sourceMappingURL=3.main.js.map