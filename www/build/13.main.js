webpackJsonp([13],{

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__alternatives__ = __webpack_require__(347);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlternativesPageModule", function() { return AlternativesPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var AlternativesPageModule = (function () {
    function AlternativesPageModule() {
    }
    return AlternativesPageModule;
}());
AlternativesPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__alternatives__["a" /* AlternativesPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__alternatives__["a" /* AlternativesPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__alternatives__["a" /* AlternativesPage */]
        ]
    })
], AlternativesPageModule);

//# sourceMappingURL=alternatives.module.js.map

/***/ }),

/***/ 347:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(111);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlternativesPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AlternativesPage = (function () {
    function AlternativesPage(renderer, navCtrl, navParams, viewCtrl) {
        this.renderer = renderer;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.alts = [];
        this.files = [];
        this.clicking = 0;
        this.item = this.navParams.get('item');
        var alt = {
            itemMake: '',
            itemType: '',
            itemPrice: '',
            itemInspiration: ''
        };
        this.alts.push(alt);
        if (this.navParams.get('alts')) {
            this.alts = this.navParams.get('alts');
            if (this.alts.length < 4) {
                this.alts.push(alt);
            }
        }
        for (var key in this.alts) {
            this.alts[key].number = Number(key) + 1;
        }
    }
    AlternativesPage.prototype.addAlts = function () {
        console.log("add alts pressed");
        this.viewCtrl.dismiss([this.alts, this.files]);
    };
    AlternativesPage.prototype.clickFile = function (i) {
        console.log("clicking file at index:");
        console.log(i);
        this.clicking = i;
        this.file.nativeElement.click();
    };
    AlternativesPage.prototype.fileChanged = function (event) {
        console.log("input file changed:");
        console.log(event);
        var file = event.target.files[0];
        console.log(file);
        this.files[this.clicking] = file;
    };
    AlternativesPage.prototype.validatePrice = function () {
        var num = this.item['itemPrice'];
        if (num && num.match(/^[0-9]+$/) == null) {
            console.log("num is not numeric");
            console.log(num);
            num = num.slice(0, -1);
        }
        this.item['itemPrice'] = num;
    };
    return AlternativesPage;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])('file'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* ElementRef */])
], AlternativesPage.prototype, "file", void 0);
AlternativesPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])({
        name: 'alternatives'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-alternatives',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/alternatives/alternatives.html"*/'<ion-content padding>\n  <h1>ITEM {{ item.number }} ALTERNATIVES</h1>\n  <hr>\n  <ion-grid>\n    <input type="file" accept="image/*" #file (change)="fileChanged($event)" style="visibility:hidden" />\n    <ion-row class="alt-wrapper">\n      <ion-col class="alt-container" *ngFor="let alt of alts; let i = index;" ion-col col-12 col-sm>\n        <h3>ALTERNATIVE {{ i + 1 }}</h3>\n        <p>Please enter the required details.</p>\n        <ion-input [(ngModel)]="alt.itemMake" type="text" placeholder="ITEM MAKE"></ion-input>\n        <ion-input [(ngModel)]="alt.itemType" type="text" placeholder="ITEM TYPE"></ion-input>\n        <ion-input [(ngModel)]="alt.itemPrice" (input)="validatePrice()" type="text" placeholder="PRICE"></ion-input>\n        <ion-input [(ngModel)]="alt.itemInspiration" type="text" placeholder="INSPIRATION FOR ITEM?"></ion-input>\n        <button ion-button type="button" (click)="clickFile(i)">{{ files[i] ? files[i].name : \'UPLOAD IMAGE\' }}</button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <button class="add-button" ion-button type="button" (click)="addAlts()">ADD</button>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/alternatives/alternatives.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* Renderer */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]])
], AlternativesPage);

//# sourceMappingURL=alternatives.js.map

/***/ })

});
//# sourceMappingURL=13.main.js.map