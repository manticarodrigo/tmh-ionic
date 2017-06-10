webpackJsonp([14],{

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__additional_room__ = __webpack_require__(346);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdditionalRoomPageModule", function() { return AdditionalRoomPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AdditionalRoomPageModule = (function () {
    function AdditionalRoomPageModule() {
    }
    return AdditionalRoomPageModule;
}());
AdditionalRoomPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__additional_room__["a" /* AdditionalRoomPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__additional_room__["a" /* AdditionalRoomPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__additional_room__["a" /* AdditionalRoomPage */]
        ]
    })
], AdditionalRoomPageModule);

//# sourceMappingURL=additional-room.module.js.map

/***/ }),

/***/ 346:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdditionalRoomPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdditionalRoomPage = (function () {
    function AdditionalRoomPage(navCtrl, navParams, viewCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.rooms = 1;
        this.rooms = this.navParams.get('rooms');
    }
    AdditionalRoomPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss(null);
    };
    AdditionalRoomPage.prototype.selected = function (type) {
        console.log('selected:');
        console.log(type);
        this.room1 = type;
    };
    AdditionalRoomPage.prototype.selectedAlso = function (type) {
        console.log('selected also:');
        console.log(type);
        this.room2 = type;
    };
    AdditionalRoomPage.prototype.continue = function () {
        console.log('continue pressed');
        if (this.rooms == 1 && this.room1) {
            this.viewCtrl.dismiss({
                room1: this.room1,
                room2: this.room2
            });
        }
        else if (this.rooms == 2 && this.room1 && this.room2) {
            this.viewCtrl.dismiss({
                room1: this.room1,
                room2: this.room2
            });
        }
        else if (!this.room1 || !this.room2) {
            var alert = this.alertCtrl.create({
                title: 'Almost there!',
                message: 'Please select additional rooms.',
                buttons: ['DISMISS']
            });
            alert.present();
        }
    };
    return AdditionalRoomPage;
}());
AdditionalRoomPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'additional-room'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-additional-room',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/additional-room/additional-room.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons end>\n      <button class="close" ion-button (click)="dismiss()">\n        <img src="assets/close.png"/>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content text-center padding>\n  <div class="center">\n    <h1 *ngIf="rooms == 1">Select an additional room:</h1>\n    <h1 *ngIf="rooms == 2">Select two additional rooms:</h1>\n    <div *ngIf="rooms > 0">\n      <h2 *ngIf="rooms == 2">Room 2</h2>\n      <button ion-button full type="button" [class.selected]="room1 == \'LIVING_ROOM\'" (click)="selected(\'LIVING_ROOM\')">Living Room<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room1 == \'DINING_ROOM\'" (click)="selected(\'DINING_ROOM\')">Dining Room<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room1 == \'BEDROOM\'" (click)="selected(\'BEDROOM\')">Bedroom<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room1 == \'HOME_OFFICE\'" (click)="selected(\'HOME_OFFICE\')">Home Office<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room1 == \'STUDIO\'" (click)="selected(\'STUDIO\')">Studio<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room1 == \'MULTIPURPOSE_ROOM\'" (click)="selected(\'MULTIPURPOSE_ROOM\')">Multipurpose Room<img class="check" src="assets/simple-check.png"></button>\n    </div>\n    <div *ngIf="rooms == 2">\n      <h2>Room 3</h2>\n      <button ion-button full type="button" [class.selected]="room2 == \'LIVING_ROOM\'" (click)="selectedAlso(\'LIVING_ROOM\')">Living Room<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room2 == \'DINING_ROOM\'" (click)="selectedAlso(\'DINING_ROOM\')">Dining Room<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room2 == \'BEDROOM\'" (click)="selectedAlso(\'BEDROOM\')">Bedroom<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room2 == \'HOME_OFFICE\'" (click)="selectedAlso(\'HOME_OFFICE\')">Home Office<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room2 == \'STUDIO\'" (click)="selectedAlso(\'STUDIO\')">Studio<img class="check" src="assets/simple-check.png"></button>\n      <button ion-button full type="button" [class.selected]="room2 == \'MULTIPURPOSE_ROOM\'" (click)="selectedAlso(\'MULTIPURPOSE_ROOM\')">Multipurpose Room<img class="check" src="assets/simple-check.png"></button>\n    </div>\n    <button class="continue" ion-button full type="button" (click)="continue()">CONTINUE</button>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/additional-room/additional-room.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* AlertController */]) === "function" && _d || Object])
], AdditionalRoomPage);

var _a, _b, _c, _d;
//# sourceMappingURL=additional-room.js.map

/***/ })

});
//# sourceMappingURL=14.main.js.map