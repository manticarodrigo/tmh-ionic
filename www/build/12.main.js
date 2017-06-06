webpackJsonp([12],{

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__confirm__ = __webpack_require__(348);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmPageModule", function() { return ConfirmPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ConfirmPageModule = (function () {
    function ConfirmPageModule() {
    }
    return ConfirmPageModule;
}());
ConfirmPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__confirm__["a" /* ConfirmPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__confirm__["a" /* ConfirmPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__confirm__["a" /* ConfirmPage */]
        ]
    })
], ConfirmPageModule);

//# sourceMappingURL=confirm.module.js.map

/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfirmPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfirmPage = (function () {
    function ConfirmPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.message = this.navParams.get('message');
    }
    ConfirmPage.prototype.submit = function () {
        console.log("submit pressed");
        this.viewCtrl.dismiss(true);
    };
    ConfirmPage.prototype.dismiss = function () {
        console.log("dismiss pressed");
        this.viewCtrl.dismiss();
    };
    return ConfirmPage;
}());
ConfirmPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])(),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-confirm',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/confirm/confirm.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons end>\n      <button class="close" ion-button (click)="dismiss()">\n        <img src="assets/close.png"/>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content text-center padding>\n  <div class="center">\n    <img src="assets/confirm.png">\n    <p *ngIf="message">{{ message }}</p>\n    <button ion-button type="button" (click)="submit()">APPROVE & SUBMIT</button>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/confirm/confirm.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]])
], ConfirmPage);

//# sourceMappingURL=confirm.js.map

/***/ })

});
//# sourceMappingURL=12.main.js.map