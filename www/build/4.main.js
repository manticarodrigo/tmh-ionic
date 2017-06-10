webpackJsonp([4],{

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__onboarding__ = __webpack_require__(360);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnboardingPageModule", function() { return OnboardingPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var OnboardingPageModule = (function () {
    function OnboardingPageModule() {
    }
    return OnboardingPageModule;
}());
OnboardingPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__onboarding__["a" /* OnboardingPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__onboarding__["a" /* OnboardingPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__onboarding__["a" /* OnboardingPage */]
        ]
    })
], OnboardingPageModule);

//# sourceMappingURL=onboarding.module.js.map

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OnboardingPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OnboardingPage = (function () {
    function OnboardingPage(navCtrl, navParams, modalCtrl, alertCtrl, userService, popoverCtrl, platform) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.popoverCtrl = popoverCtrl;
        this.platform = platform;
        this.step = 0;
        this.type = '';
        this.styleQuestions = {
            1: {
                answer: '',
                answering: false
            },
            2: {
                answer: '',
                answering: false
            },
            3: {
                answer: '',
                answering: false
            },
            4: {
                answer: '',
                answering: false
            }
        };
        this.package = 0;
        this.additionalRooms = {
            room1: '',
            room2: ''
        };
        this.finalQuestion = 1;
        this.zip = '';
        this.shares = '';
        this.pet = false;
        this.limitedAccess = false;
        this.budget = 0;
        this.costs = {
            1: 399,
            2: 699,
            3: 999
        };
        this.billing = {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zip: ''
        };
        this.card = {
            number: '',
            name: '',
            expDate: null,
            code: ''
        };
        this.saveCard = true;
        this.payWithSaved = false;
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                _this.user = user;
                _this.fetchCreditCard();
            }
            else {
                _this.navCtrl.setRoot('login');
            }
        });
    }
    OnboardingPage.prototype.fetchCreditCard = function () {
        var _this = this;
        console.log("fetching credit card");
        this.userService.fetchCreditCard(this.user)
            .then(function (data) {
            console.log("onboarding component received credit card data:");
            console.log(data);
            if (!data['exception'] && Object.keys(data).length != 0) {
                _this.savedCard = data;
            }
        });
    };
    OnboardingPage.prototype.backPressed = function () {
        console.log("back pressed");
        if (this.step == 4) {
            this.finalQuestion = 1;
        }
        if (this.step == 3) {
            this.styleQuestions[1].answering = true;
        }
        if (this.step == 2 || this.step == 3) {
            this.styleQuestions = {
                1: {
                    answer: '',
                    answering: false
                },
                2: {
                    answer: '',
                    answering: false
                },
                3: {
                    answer: '',
                    answering: false
                },
                4: {
                    answer: '',
                    answering: false
                }
            };
        }
        this.step = this.step - 1;
    };
    OnboardingPage.prototype.homePressed = function () {
        console.log("logo pressed");
        this.navCtrl.setRoot('dashboard');
    };
    OnboardingPage.prototype.startProject = function () {
        console.log("start pressed");
        this.step = 1;
    };
    OnboardingPage.prototype.selectedType = function (type) {
        console.log("selected room type:");
        console.log(type);
        this.step = 2;
        this.type = type;
        this.styleQuestions[1].answering = true;
    };
    OnboardingPage.prototype.selectedStyle = function (index, style) {
        console.log("selected index and style:");
        console.log(index, style);
        this.styleQuestions[index].answer = style;
        this.styleQuestions[index].answering = false;
        if (index < 4) {
            this.styleQuestions[index + 1].answering = true;
        }
        else if (index == 4) {
            this.step = 3;
        }
    };
    OnboardingPage.prototype.selectedPackage = function (n) {
        var _this = this;
        console.log("selected package:");
        console.log(n);
        if (n == 3) {
            var modal = this.modalCtrl.create('AdditionalRoom', {
                rooms: 2
            });
            modal.onDidDismiss(function (data) {
                console.log("received data from modal");
                console.log(data);
                if (data && data.room1 && data.room2) {
                    _this.package = n;
                    _this.additionalRooms.room1 = data.room1;
                    _this.additionalRooms.room2 = data.room2;
                    _this.step = 4;
                }
                else {
                    _this.step = 3;
                }
            });
            modal.present();
        }
        else if (n == 2) {
            var modal = this.modalCtrl.create('AdditionalRoom', {
                rooms: 1
            });
            modal.onDidDismiss(function (data) {
                console.log("received data from modal");
                console.log(data);
                if (data && data.room1) {
                    _this.package = n;
                    _this.additionalRooms.room1 = data.room1;
                    _this.step = 4;
                }
                else {
                    _this.step = 3;
                }
            });
            modal.present();
        }
        else {
            this.package = n;
            this.step = 4;
        }
    };
    OnboardingPage.prototype.requestInternational = function () {
        console.log("international address pressed");
        var modal = this.modalCtrl.create('IntlAddress');
        modal.onDidDismiss(function (data) {
            console.log(data);
        });
        modal.present();
    };
    OnboardingPage.prototype.validateZip = function () {
        var num = this.zip.split("-").join(""); // remove hyphens
        if (num.match(/^[0-9]+$/) == null) {
            console.log("num is not numeric");
            console.log(num);
            num = num.slice(0, -1);
        }
        this.zip = num;
    };
    OnboardingPage.prototype.submittedZip = function () {
        console.log("zip submitted:");
        console.log(this.zip);
        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.zip);
        if (isValidZip) {
            this.finalQuestion = 2;
        }
        else {
            var alert = this.alertCtrl.create({
                title: 'Bad Zip',
                message: 'Please enter a valid 5-digit U.S. zip code.',
                buttons: ['DISMISS']
            });
            alert.present();
        }
    };
    OnboardingPage.prototype.sharesWith = function (answer) {
        console.log("shares with submitted:");
        console.log(answer);
        this.shares = answer;
        this.finalQuestion = 3;
    };
    OnboardingPage.prototype.hasPet = function (bool) {
        console.log("has pet:");
        console.log(bool);
        this.pet = bool;
        this.finalQuestion = 4;
    };
    OnboardingPage.prototype.hasLimitedAccess = function (bool) {
        console.log("has limited access:");
        console.log(bool);
        this.limitedAccess = bool;
        this.finalQuestion = 5;
    };
    OnboardingPage.prototype.hasBudget = function (n) {
        console.log("has budget:");
        console.log(n);
        this.budget = n;
        this.step = 5;
    };
    OnboardingPage.prototype.validateCardNumber = function () {
        var num = this.card.number.split("-").join(""); // remove hyphens
        if (num.match(/^[0-9]+$/) == null) {
            console.log("num is not numeric");
            console.log(num);
            num = num.slice(0, -1);
        }
        if (num.length > 0) {
            num = num.match(new RegExp('.{1,4}', 'g')).join("-");
        }
        this.card.number = num;
    };
    OnboardingPage.prototype.paymentPressed = function () {
        console.log("payment pressed");
    };
    OnboardingPage.prototype.paypalPressed = function () {
        console.log("paypal pressed");
    };
    return OnboardingPage;
}());
OnboardingPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'onboarding'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-onboarding',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/onboarding/onboarding.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:10px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-buttons end>\n      <button class="avatar" ion-button menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content text-center padding>\n\n  <div *ngIf="step > 0" class="step-back-button">\n    <button ion-button type="button" (click)="backPressed()"><img src="assets/left-arrow.png">BACK</button>\n  </div>\n\n  <div *ngIf="step == 0" class="welcome">\n    <h1>WELCOME TO<br>THE MAN HOME</h1>\n    <p>Time to like where you wake up</p>\n    <button ion-button type="button" (click)="startProject()" full>START YOUR PROJECT</button>\n  </div>\n\n  <ion-grid *ngIf="step == 1" class="step1">\n    <div class="step-title">\n      <h1>ROOM SELECTION</h1>\n      <p>STEP 1/5<p>\n    </div>\n    <div class="step-subtitle">\n      <h2>Select your space:</h2>\n    </div>\n    <ion-row>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'LIVING_ROOM\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img src="assets/LIVING_ROOM.png">\n              <h4>Living Room</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'BEDROOM\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img src="assets/BEDROOM.png">\n              <h4>Bedroom</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'DINING_ROOM\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img src="assets/DINING_ROOM.png">\n              <h4>Dining Room</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'HOME_OFFICE\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img src="assets/HOME_OFFICE.png">\n              <h4>Home Office</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'STUDIO\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img class="wide" src="assets/STUDIO.png">\n              <h4>Studio</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="space-button" (click)="selectedType(\'MULTIPURPOSE_ROOM\')">\n          <div class="space-button-content">\n            <div class="space-button-content-center">\n              <img class="wide" src="assets/MULTIPURPOSE_ROOM.png">\n              <h4>Multipurpose Room</h4>\n            </div>\n          </div>\n        </div>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n\n  <ion-grid *ngIf="step == 2" class="step2">\n    <div class="step-title">\n      <h1>STYLE PREFERENCE</h1>\n      <p>STEP 2/5<p>\n    </div>\n    <div class="step-subtitle">\n      <h2>Select which style best fits you:</h2>\n    </div>\n    <ion-row *ngFor="let i of [1,2,3,4]" class="style-question" [class.active]="styleQuestions[i].answering == true">\n      <ion-col>\n        <div class="style-button" (click)="selectedStyle(i, 1)">\n          <div class="style-button-content">\n            <img class="check" src="assets/check.png">\n            <img class="q-img" src="assets/q{{i}}_style1.jpg">\n          </div>\n        </div>\n      </ion-col>\n      <ion-col>\n        <div class="style-button" (click)="selectedStyle(i, 2)">\n          <div class="style-button-content">\n            <img class="check" src="assets/check.png">\n            <img class="q-img" src="assets/q{{i}}_style2.jpg">\n          </div>\n        </div>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n\n  <ion-grid *ngIf="step == 3" class="step3">\n    <div class="step-title">\n      <h1>PACKAGE</h1>\n      <p>STEP 3/5<p>\n    </div>\n    <div class="step-subtitle">\n      <h2>How many spaces are you working on?</h2>\n    </div>\n    <ion-row class="packages">\n      <ion-col col-12 col-sm>\n        <div class="package-button">\n          <div class="package-button-content">\n            <img src="assets/door.png">\n            <h2>SINGLE ROOM</h2>\n            <p>Keep it simple. Start with a single room.</p>\n            <h1>$399</h1>\n            <button ion-button full (click)="selectedPackage(1)">SELECT</button>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="package-button">\n          <div class="package-button-content">\n            <img src="assets/two-doors.png">\n            <h2>DOUBLE ROOM</h2>\n            <p>Cover more of your floor plan.</p>\n            <h1>$699</h1>\n            <button ion-button full (click)="selectedPackage(2)">SELECT</button>\n          </div>\n        </div>\n      </ion-col>\n      <ion-col col-12 col-sm>\n        <div class="package-button">\n          <div class="package-button-content">\n            <img src="assets/three-doors.png">\n            <h2>TRIPLE ROOM</h2>\n            <p>Impress throughout your home.</p>\n            <h1>$999</h1>\n            <button ion-button full (click)="selectedPackage(3)">SELECT</button>\n          </div>\n        </div>\n      </ion-col>\n    </ion-row>\n    <div class="features">\n      <h1>INCLUDED IN EACH PACKAGE</h1>\n      <ul>\n        <h2>Full service design:</h2>\n        <li>10 day design process per room</li>\n        <li>2 concept board options</li>\n        <li>3 design revisions</li>\n        <li>Chat service with personal designer</li>\n      </ul>\n      <ul>\n        <h2>Final delivery:</h2>\n        <li>3D Virtual Tour of design</li>\n        <li>Concept Board and Floor Plan</li>\n        <li>Shopping List & Cart</li>\n        <li>Detailed set-up instructions</li>\n      </ul>\n    </div>\n  </ion-grid>\n\n  <ion-grid *ngIf="step == 4" class="step4">\n    <div class="step-title">\n      <h1>FINAL QUESTIONS</h1>\n      <p>STEP 4/5<p>\n    </div>\n    <div class="step-subtitle">\n      <h2>Just a few questions. We promise.</h2>\n    </div>\n    <div *ngIf="finalQuestion == 1" class="zip-button">\n      <div class="zip-button-content">\n        <h1>1/5</h1>\n        <h4>What\'s your ZIP code?</h4>\n        <ion-input [(ngModel)]="zip" (input)="validateZip()" maxlength="5" type="text" placeholder="ZIP"></ion-input>\n        <p><a (click)="requestInternational()">International address?</a></p>\n        <button ion-button full (click)="submittedZip()">CONTINUE</button>\n      </div>\n    </div>\n    <div *ngIf="finalQuestion == 2" class="shares-button final-question">\n      <div class="shares-button-content">\n        <h1>2/5</h1>\n        <h4>Who do you share your space with?</h4>\n        <button ion-button full (click)="sharesWith(\'myself\')">Myself<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="sharesWith(\'partner\')">Partner<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="sharesWith(\'roomate\')">Roomate(s)<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="sharesWith(\'family\')">Family<img class="check" src="assets/simple-check.png"></button>\n      </div>\n    </div>\n    <div *ngIf="finalQuestion == 3" class="pet-button final-question">\n      <div class="pet-button-content">\n        <h1>3/5</h1>\n        <h4>Would you like your designer to select pet friendly options?</h4>\n        <button ion-button full (click)="hasPet(true)">YES<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="hasPet(false)">NO<img class="check" src="assets/simple-check.png"></button>\n      </div>\n    </div>\n    <div *ngIf="finalQuestion == 4" class="access-button final-question">\n      <div class="access-button-content">\n        <h1>4/5</h1>\n        <h4>Is it difficult moving furniture in and out of your home? (i.e. narrow hallways)</h4>\n        <button ion-button full (click)="hasLimitedAccess(true)">YES<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="hasLimitedAccess(false)">NO<img class="check" src="assets/simple-check.png"></button>\n      </div>\n    </div>\n    <div *ngIf="finalQuestion == 5" class="budget-button final-question">\n      <div class="budget-button-content">\n        <h1>5/5</h1>\n        <h4>What is your furniture budget per room?</h4>\n        <button ion-button full (click)="hasBudget(1)">$2k or less<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="hasBudget(2)">$2k - $4k<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="hasBudget(3)">$4k - $6k<img class="check" src="assets/simple-check.png"></button>\n        <button ion-button full (click)="hasBudget(4)">$6k or more<img class="check" src="assets/simple-check.png"></button>\n      </div>\n    </div>\n  </ion-grid>\n\n  <ion-grid *ngIf="step == 5" class="step5">\n    <div class="step-title">\n      <h1>DESIGN PAYMENT</h1>\n      <p>STEP 5/5<p>\n    </div>\n    <div class="step-subtitle">\n      <h2>Once we receive your payment, we can get started.</h2>\n    </div>\n    <div class="payment-form">\n      <div class="summary">\n        <div class="box">\n          <h1>PROJECT SUMMARY</h1>\n          <p>Package: <span class="right">{{ rooms }} Room(s)</span></p>\n          <p>Duration: <span class="right">10 Days</span></p>\n          <p>Cost: <span class="right">${{ costs[rooms] }}.00</span></p>\n          <p><b>Total: <span class="right">${{ costs[rooms] }}.00</span></b></p>\n        </div>\n        <button class="paypal-button" ion-button full (click)="paypalPressed()" type="button">PAY WITH PAYPAL</button>\n        <button class="payment-button desktop" ion-button full (click)="payPressed()" type="button">PAY WITH CARD</button>\n      </div>\n      <br>\n      <!--<div class="billing">\n        <p>Billing Information</p>\n        <ion-input [(ngModel)]="billing.firstName" type="text" placeholder="FIRST NAME"></ion-input>\n        <ion-input [(ngModel)]="billing.lastName" type="text" placeholder="LAST NAME"></ion-input>\n        <ion-input [(ngModel)]="billing.address" type="text" placeholder="ADDRESS"></ion-input>\n        <ion-input [(ngModel)]="billing.city" type="text" placeholder="CITY"></ion-input>\n        <ion-input [(ngModel)]="billing.country" type="text" placeholder="COUNTRY"></ion-input>\n        <ion-input [(ngModel)]="billing.zip" type="text" placeholder="ZIP"></ion-input>\n      </div>-->\n      <div *ngIf="savedCard" class="saved-card">\n        <ion-item>\n          <ion-label stacked>Saved Card Information</ion-label>\n          <ion-input disabled value="****-****-****-{{ savedCard.last4 }}"></ion-input>\n        </ion-item>\n        <ion-input disabled value="{{ savedCard.name }}"></ion-input>\n        <ion-item class="checkbox-container">\n          <ion-checkbox [(ngModel)]="payWithSaved"></ion-checkbox>\n          <ion-label>Use Card</ion-label>\n        </ion-item>\n      </div>\n      <div class="card">\n        <ion-item>\n          <ion-label stacked>Credit Card Information</ion-label>\n          <ion-input [(ngModel)]="card.number" (input)="validateCardNumber()" maxlength="19" type="text" placeholder="0000-0000-0000-0000"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-input [(ngModel)]="card.name" type="text" placeholder="NAME ON CARD"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>Expiration Date</ion-label>\n          <ion-datetime [(ngModel)]="card.expDate" type="text" displayFormat="MM/YYYY" pickerFormat="MM/YYYY" placeholder="MM/YYYY"></ion-datetime>\n        </ion-item>\n        <ion-item>\n          <ion-label stacked>Security Code</ion-label>\n          <ion-input [(ngModel)]="card.code" maxlength="3" type="text" placeholder="***"></ion-input>\n        </ion-item>\n        <ion-item class="checkbox-container">\n          <ion-checkbox [(ngModel)]="saveCard"></ion-checkbox>\n          <ion-label>Save payment information</ion-label>\n        </ion-item>\n      </div>\n      <button class="payment-button mobile" ion-button full (click)="payPressed()" type="button">PAY WITH CARD</button>\n    </div>\n  </ion-grid>\n\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/onboarding/onboarding.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* AlertController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* PopoverController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* PopoverController */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */]) === "function" && _g || Object])
], OnboardingPage);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=onboarding.js.map

/***/ })

});
//# sourceMappingURL=4.main.js.map