webpackJsonp([5],{

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(359);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPageModule", function() { return LoginPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LoginPageModule = (function () {
    function LoginPageModule() {
    }
    return LoginPageModule;
}());
LoginPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */]
        ]
    })
], LoginPageModule);

//# sourceMappingURL=login.module.js.map

/***/ }),

/***/ 359:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_facebook__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_image_service__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { Facebook } from 'ionic-native';



var LoginPage = (function () {
    function LoginPage(navCtrl, navParams, alertCtrl, platform, fb, userService, imageService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.fb = fb;
        this.userService = userService;
        this.imageService = imageService;
        this.loading = false;
        this.signup = false;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.password2 = '';
        this.FB_APP_ID = 1566594110311271;
        this.permissions = [
            'public_profile',
        ];
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                _this.navCtrl.setRoot('dashboard');
            }
        });
        this.platform.ready().then(function () {
            // Check If Cordova/Mobile
            if (_this.platform.is('cordova')) {
                // Native Facebook sdk
                // Facebook.browserInit(this.FB_APP_ID, "v2.8");
            }
            else {
                // Web Facebook sdk
                _this.fb.init({
                    appId: '1566594110311271',
                    version: 'v2.8'
                });
            }
        });
    }
    LoginPage.prototype.toggleType = function () {
        console.log("Toggling auth type");
        this.signup = !this.signup;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.password2 = '';
    };
    LoginPage.prototype.auth = function () {
        this.loading = true;
        if (this.signup) {
            this.register();
        }
        else {
            this.login();
        }
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        var self = this;
        console.log("login pressed");
        if (this.email == '' || this.password == '') {
            this.presentError('Please provide a valid email and password.');
            this.loading = false;
        }
        else {
            this.userService.login(this.email, this.password, function (user) {
                console.log(user);
                if (!user.exception) {
                    var token = btoa(_this.email + ':' + _this.password);
                    self.userService.setCurrentUser(user, token)
                        .then(function (user) {
                        _this.navCtrl.setRoot('DashboardPage');
                        _this.email = '';
                        _this.password = '';
                        _this.loading = false;
                    });
                }
                else {
                    _this.presentError('No user found with the provided credentials.');
                    _this.loading = false;
                }
            });
        }
    };
    LoginPage.prototype.register = function () {
        var _this = this;
        var self = this;
        console.log("signup pressed");
        if (this.firstName == '' || this.email == '' || this.password == '' || this.password2 == '') {
            this.presentError('Please provide a first name, email, and matching passwords.');
            this.loading = false;
        }
        else if (this.password != this.password2) {
            this.presentError('The provided password do not match.');
            this.loading = false;
        }
        else {
            this.userService.register(this.firstName, this.lastName, this.email, this.password, this.password2)
                .then(function (user) {
                console.log(user);
                if (!user['exception']) {
                    var token = btoa(_this.email + ':' + _this.password);
                    self.userService.setCurrentUser(user, token)
                        .then(function (user) {
                        _this.firstName = '';
                        _this.lastName = '';
                        _this.email = '';
                        _this.password = '';
                        _this.password2 = '';
                        _this.loading = false;
                        _this.navCtrl.setRoot('DashboardPage');
                    });
                }
                else {
                    _this.presentError('Registration failed. Please try again.');
                    _this.loading = false;
                }
            });
        }
    };
    LoginPage.prototype.facebookLogin = function () {
        var _this = this;
        var self = this;
        // Check If Cordova/Mobile
        if (this.platform.is('cordova')) {
            console.log("Starting Mobile Facebook login...");
            // Facebook.login(env.permissions)
            // .then(response => {
            //     console.log("Mobile Facebook login returned response.");
            //     this.loading = false;
            //     resolve(response);
            // })
            // .catch(error => {
            //     console.log(error);
            //     reject(error);
            // });
        }
        else {
            console.log("Starting Core Facebook login...");
            self.fb.login()
                .then(function (response) {
                console.log("Core Facebook login returned response:");
                console.log(response);
                _this.loading = false;
                // this.userService.register(this.firstName, this.lastName, this.email, this.password, this.password2, (data) => {
                //   console.log(data);
                //   if (!data.exception) {
                //     this.firstName = '';
                //     this.lastName = '';
                //     this.email = '';
                //     this.password = '';
                //     this.password2 = '';
                //     this.loading = false;
                //     this.navCtrl.setRoot('DashboardPage');
                //   } else {
                //     this.presentError('Registration failed. Please try again.');
                //     this.loading = false;
                //   }
                // });
            })
                .catch(function (error) {
                console.log(error);
                _this.loading = false;
            });
        }
    };
    LoginPage.prototype.presentError = function (message) {
        var alert = this.alertCtrl.create({
            title: 'Login Failed',
            message: message,
            buttons: ['Dismiss']
        });
        alert.present();
    };
    return LoginPage;
}());
LoginPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])({
        name: 'login',
        priority: 'high'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-login',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/login/login.html"*/'<ion-content text-center padding>\n  <div class="center">\n    <form>\n      <img class="logo" src="assets/logo.png">\n      <div *ngIf="!loading">\n        <ion-input *ngIf="signup" [(ngModel)]="firstName" name="firstName" type="text" placeholder="FIRST NAME"></ion-input>\n        <ion-input *ngIf="signup" [(ngModel)]="lastName" name="lastName" type="text" placeholder="LAST NAME"></ion-input>\n        <ion-input [(ngModel)]="email" name="email" type="email" placeholder="EMAIL"></ion-input>\n        <ion-input [(ngModel)]="password" name="password" type="password" placeholder="PASSWORD"></ion-input>\n        <ion-input *ngIf="signup" [(ngModel)]="password2" name="password2" type="password" placeholder="CONFIRM PASSWORD"></ion-input>\n        <button ion-button class="auth" type="submit" (click)="auth()">{{ signup ? \'SIGN UP\' : \'LOG IN\'}}</button>\n        <button ion-button class="facebook" type="button" (click)="facebookLogin()">{{ signup ? \'SIGN UP WITH FACEBOOK\' : \'LOG IN WITH FACEBOOK\'}}</button>\n        <p *ngIf="!signup"><a>Forgot your password?</a></p>\n        <hr>\n        <p>or</p>\n        <button ion-button class="toggle" type="button" (click)="toggleType()">{{ signup ? \'LOG IN\' : \'SIGN UP\'}}</button>\n      </div>\n      <ion-spinner *ngIf="loading" name="crescent">\n      </ion-spinner>\n    </form>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/login/login.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2_ngx_facebook__["a" /* FacebookService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_4__providers_image_service__["a" /* ImageService */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ })

});
//# sourceMappingURL=5.main.js.map