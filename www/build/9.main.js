webpackJsonp([9],{

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__edit_item__ = __webpack_require__(355);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditItemPageModule", function() { return EditItemPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var EditItemPageModule = (function () {
    function EditItemPageModule() {
    }
    return EditItemPageModule;
}());
EditItemPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__edit_item__["a" /* EditItemPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__edit_item__["a" /* EditItemPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__edit_item__["a" /* EditItemPage */]
        ]
    })
], EditItemPageModule);

//# sourceMappingURL=edit-item.module.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditItemPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EditItemPage = (function () {
    function EditItemPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.item = {};
        if (this.navParams.get('item')) {
            this.item = this.navParams.get('item');
        }
    }
    EditItemPage.prototype.savePressed = function () {
        console.log("save pressed");
        if (this.selectedFile) {
            this.item['file'] = this.selectedFile;
        }
        this.viewCtrl.dismiss(this.item);
    };
    EditItemPage.prototype.fileChanged = function (event) {
        console.log("input file changed:");
        var file = event.target.files[0];
        console.log(file);
        this.selectedFile = file;
    };
    EditItemPage.prototype.validatePrice = function () {
        var num = this.item['itemPrice'];
        if (num && num.match(/^[0-9]+$/) == null) {
            console.log("num is not numeric");
            console.log(num);
            num = num.slice(0, -1);
        }
        this.item['itemPrice'] = num;
    };
    return EditItemPage;
}());
EditItemPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'edit-item'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-edit-item',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/edit-item/edit-item.html"*/'<ion-content padding>\n  <h1 *ngIf="!item">NEW ITEM</h1>\n  <h1 *ngIf="item">ITEM {{ item.number }}</h1>\n  <p>Please enter the required details.</p>\n  <ion-input [(ngModel)]="item.itemMake" type="text" placeholder="ITEM MAKE"></ion-input>\n  <ion-input [(ngModel)]="item.itemType" type="text" placeholder="ITEM TYPE"></ion-input>\n  <ion-input [(ngModel)]="item.itemPrice" (input)="validatePrice()" type="text" placeholder="PRICE"></ion-input>\n  <ion-input [(ngModel)]="item.itemInspiration" type="text" placeholder="INSPIRATION FOR ITEM?"></ion-input>\n  <input type="file" accept="image/*" #file (change)="fileChanged($event)" style="visibility:hidden" />\n  <button ion-button full type="button" (click)="file.click()">UPLOAD IMAGE</button>\n  <p>{{ selectedFile ? selectedFile.name : \'No image selected\' }}</p>\n  <button ion-button full type="button" (click)="savePressed()">{{ item ? \'SAVE\' : \'ADD\'}}</button>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/edit-item/edit-item.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]])
], EditItemPage);

//# sourceMappingURL=edit-item.js.map

/***/ })

});
//# sourceMappingURL=9.main.js.map