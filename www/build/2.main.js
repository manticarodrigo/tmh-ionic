webpackJsonp([2],{

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shopping_cart__ = __webpack_require__(362);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShoppingCartPageModule", function() { return ShoppingCartPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ShoppingCartPageModule = (function () {
    function ShoppingCartPageModule() {
    }
    return ShoppingCartPageModule;
}());
ShoppingCartPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__shopping_cart__["a" /* ShoppingCartPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__shopping_cart__["a" /* ShoppingCartPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__shopping_cart__["a" /* ShoppingCartPage */]
        ]
    })
], ShoppingCartPageModule);

//# sourceMappingURL=shopping-cart.module.js.map

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(43);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShoppingCartPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ShoppingCartPage = (function () {
    function ShoppingCartPage(navCtrl, navParams, userService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.cartTotal = 0;
        this.userService.fetchCurrentUser()
            .then(function (user) {
            if (user) {
                _this.user = user;
            }
            else {
                _this.navCtrl.setRoot('login');
            }
        });
    }
    return ShoppingCartPage;
}());
ShoppingCartPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])({
        name: 'shopping-cart',
        segment: 'shopping-cart/:id'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-shopping-cart',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/shopping-cart/shopping-cart.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:5px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-title>Shopping Cart</ion-title>\n    <ion-buttons end>\n      <button class="avatar" ion-button  menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/tmh.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <div class="sub-nav">\n    <button ion-button type="button" (click)="backPressed()">\n      <img src="assets/left-arrow.png">\n      BACK TO DESIGN STUDIO\n    </button>\n  </div>\n</ion-header>\n\n<ion-content padding>\n\n  <div class="summary">\n    <button class="paypal-button" ion-button full (click)="paypalPressed()" type="button">{{ selectedItems.length > 0 ? \'ESTIMATE SHIPPING AND TAX\' : \'NO ITEMS SELECTED\' }}</button>\n    <div class="box">\n      <h1 *ngIf="selectedItems.length > 0">{{ selectedItems.length }} ITEMS</h1>\n      <h1 *ngIf="!selectedItems.length > 0">NO ITEMS</h1>\n      <p>Item(s): <span class="right">${{ cartTotal/100 }}</span></p>\n      <p>Estimated Tax: <span class="right">-</span></p>\n      <p>Delivery: <span class="right">-</span></p>\n      <h2>Order Total: <span class="right">${{ cartTotal/100 }}</span></h2>\n    </div>\n  </div>\n\n  <div class="dashboard-header desktop">\n    <div class="section type">\n      <img src="assets/BEDROOM.png">\n    </div>\n    <div class="section">\n      <p class="info">Item</p>\n    </div>\n    <div class="section">\n      <p class="info">Price</p>\n    </div>\n    <div class="section">\n      <p class="info">Quantity</p>\n    </div>\n    <div class="section">\n      <p class="info">Shipping</p>\n    </div>\n    <div class="section">\n      <p class="info">Total</p>\n    </div>\n  </div>\n\n  <ion-list>\n\n    <ion-item class="item-container" *ngFor="let item of items">\n      <div class="item-wrapper">\n        <div class="section main">\n          <ion-checkbox [(ngModel)]="itemMap[item.projectItemId].selected" (ionChange)="selectedItem(item)"></ion-checkbox>\n          <img src="{{ itemMap[item.projectItemId].url }}">\n        </div>\n        <div class="section">\n          <p class="info">{{ item.itemMake }}</p>\n          <br>\n          <p class="info opaque">{{ item.itemType }}</p>\n        </div>\n        <div class="section">\n          <p class="info">{{ item.itemPrice }}</p>\n        </div>\n        <div class="section">\n          <button class="quantity" ion-button type="button" (click)="selectQuantity(item)" full>\n            {{ itemMap[item.projectItemId].quantity }}\n            <img src="assets/down.png">\n          </button>\n        </div>\n        <div class="section">\n          <p class="info">-</p>\n        </div>\n        <div class="section">\n          <p class="info">-</p>\n        </div>\n      </div>\n    </ion-item>\n  \n  </ion-list>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/shopping-cart/shopping-cart.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_user_service__["a" /* UserService */]])
], ShoppingCartPage);

//# sourceMappingURL=shopping-cart.js.map

/***/ })

});
//# sourceMappingURL=2.main.js.map