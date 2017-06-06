webpackJsonp([1],{

/***/ 336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__details__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__chat_chat__ = __webpack_require__(352);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailsPageModule", function() { return DetailsPageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var DetailsPageModule = (function () {
    function DetailsPageModule() {
    }
    return DetailsPageModule;
}());
DetailsPageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__details__["a" /* DetailsPage */],
            __WEBPACK_IMPORTED_MODULE_3__chat_chat__["a" /* ChatPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__details__["a" /* DetailsPage */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__details__["a" /* DetailsPage */],
            __WEBPACK_IMPORTED_MODULE_3__chat_chat__["a" /* ChatPage */]
        ]
    })
], DetailsPageModule);

//# sourceMappingURL=details.module.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_chat_service__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_image_service__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { Camera, PhotoViewer } from 'ionic-native';




var ChatPage = (function () {
    function ChatPage(navCtrl, navParams, viewCtrl, actionSheetCtrl, alertCtrl, loadingCtrl, statusBar, chatService, userService, imageService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.statusBar = statusBar;
        this.chatService = chatService;
        this.userService = userService;
        this.imageService = imageService;
        this.message = {
            text: '',
            id: null,
            senderId: null,
            createdAt: null
        };
        this.memberMap = {};
        this.fileMap = {};
        this.memberMap[this.userService.currentUser.userId] = {
            firstName: this.userService.currentUser.firstName,
            photoURL: this.userService.currentUser.photoURL,
            loading: false
        };
        if (this.navParams.get('project')) {
            this.project = this.navParams.get('project');
            console.log("found project for chat:");
            console.log(this.project);
            this.chatService.join(this.project.projectId);
            this.fetchMessages();
            this.observeMessages();
        }
    }
    ChatPage.prototype.ionViewWillLoad = function () {
        // this.statusBar.styleDefault();
    };
    ChatPage.prototype.ionViewWillLeave = function () {
        // this.statusBar.styleLightContent();
        if (this.project) {
            this.chatService.leave(this.project.projectId);
        }
    };
    ChatPage.prototype.fetchMessages = function () {
        var self = this;
        this.chatService.fetchMessages()
            .then(function (data) {
            console.log("chat component received messages:");
            console.log(data);
            if (data) {
                var messageArr = [];
                for (var key in data[0]) {
                    if (data[0].hasOwnProperty(key) && key != '_id') {
                        var message = data[0][key];
                        if (!self.memberMap[message.senderId]) {
                            self.addMemberData(message.senderId);
                        }
                        if (message.createdAt) {
                            message.createdAtReadable = self.getTimeStringFrom(message.createdAt);
                        }
                        if (message.fileEntryId) {
                            self.fetchImage(message.fileEntryId);
                        }
                        messageArr.push(message);
                    }
                }
                messageArr.sort(function (a, b) {
                    return a.createdAt - b.createdAt;
                });
                self.messages = messageArr;
                setTimeout(function () {
                    self.scrollToBottom();
                }, 500);
            }
            else {
                self.messages = null;
            }
        });
    };
    ChatPage.prototype.fetchImage = function (fileEntryId) {
        var self = this;
        this.imageService.getFileEntry(fileEntryId)
            .then(function (data) {
            console.log("chat component received file:");
            console.log(data);
            if (!data['exception']) {
                self.fileMap[fileEntryId] = data;
            }
        });
    };
    ChatPage.prototype.observeMessages = function () {
        var _this = this;
        var self = this;
        this.chatService.observeMessages(function (data) {
            console.log("chat component received message:");
            console.log(data);
            if (!self.memberMap[data['senderId']]) {
                self.addMemberData(data['senderId']);
            }
            if (data['createdAt']) {
                data['createdAtReadable'] = _this.getTimeStringFrom(data['createdAt']);
            }
            if (data['fileEntryId']) {
                self.fetchImage(data['fileEntryId']);
            }
            _this.messages.push(data);
            _this.scrollToBottom();
        });
    };
    ChatPage.prototype.addMemberData = function (uid) {
        var self = this;
        var headers = this.userService.headers;
        if (!this.memberMap[uid]) {
            self.memberMap[uid] = {
                loading: true
            };
            self.userService.fetchUser(uid)
                .then(function (user) {
                if (!user['exception'] && user['portraitId']) {
                    if (user['file']) {
                        self.memberMap[uid] = {
                            firstName: user['firstName'],
                            photoURL: self.imageService.createFileUrl(user['file']),
                            loading: false
                        };
                    }
                    else {
                        self.imageService.imageForUser(user)
                            .then(function (url) {
                            if (url) {
                                self.memberMap[uid] = {
                                    firstName: user['firstName'],
                                    photoURL: url,
                                    loading: false
                                };
                            }
                            else {
                                console.log("No image found");
                                self.memberMap[uid] = null;
                            }
                        });
                    }
                }
                else {
                    console.log("Got back object instead of valid user:");
                    console.log(user);
                    self.memberMap[uid] = null;
                }
            });
        }
    };
    ChatPage.prototype.scrollToBottom = function () {
        console.log("Scrolling to bottom!");
        var dimensions = this.content.getContentDimensions();
        if (this.content.getContentDimensions()) {
            this.content.scrollToBottom(300);
            // this.content.scrollTo(0, dimensions.scrollHeight, 250); //x, y, ms animation speed
        }
        else {
            console.log("Content not loaded");
        }
    };
    ChatPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ChatPage.prototype.send = function () {
        var _this = this;
        var self = this;
        var text = this.message.text.replace(/^\s+/, '').replace(/\s+$/, '');
        if (text !== '') {
            // text has real content
            var msgData = {
                message: {
                    text: self.message.text,
                    id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
                    senderId: this.userService.currentUser.userId,
                    createdAt: new Date().getTime()
                },
                room: this.project.projectId
            };
            this.chatService.send(msgData, function (savedToLocal) {
                self.message = {
                    text: '',
                    id: null,
                    senderId: _this.userService.currentUser.userId,
                    createdAt: null
                };
            });
        }
    };
    ChatPage.prototype.fileChanged = function (event) {
        var _this = this;
        var self = this;
        console.log("file changed:");
        console.log(event.target.files[0]);
        this.imageService.uploadFile(event.target.files[0], this.project)
            .then(function (data) {
            console.log("chat component received data:");
            console.log(data);
            if (!data['exception']) {
                var msgData = {
                    message: {
                        fileEntryId: data['fileEntryId'],
                        id: _this.message.id ? _this.message.id : Math.ceil(Math.random() * 1000),
                        senderId: _this.userService.currentUser.userId,
                        createdAt: new Date().getTime()
                    },
                    room: _this.project.projectId
                };
                _this.chatService.send(msgData, function (savedToLocal) {
                    self.message = {
                        text: '',
                        id: null,
                        senderId: _this.userService.currentUser.userId,
                        createdAt: null
                    };
                });
            }
        });
    };
    // showImage(url) {
    //   PhotoViewer.show(url);
    // }
    // presentActionSheet() {
    //   let actionSheet = this.actionSheetCtrl.create({
    //   title: 'Select Image Source',
    //   cssClass: 'action-sheet',
    //   buttons: [
    //       {
    //       text: 'Photo Library',
    //       handler: () => {
    //           this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
    //       }
    //       },
    //       {
    //       text: 'Camera',
    //       handler: () => {
    //           this.takePicture(Camera.PictureSourceType.CAMERA);
    //       }
    //       },
    //       {
    //       text: 'Cancel',
    //       role: 'cancel'
    //       }
    //   ]
    //   });
    //   actionSheet.present();
    // }
    // takePicture(sourceType) {
    //   // Create options for the Camera Dialog
    //   var options = {
    //       quality: 100,
    //       destinationType : Camera.DestinationType.DATA_URL,
    //       sourceType: sourceType,
    //       allowEdit : true,
    //       encodingType: Camera.EncodingType.PNG,
    //       targetWidth: 500,
    //       targetHeight: 500,
    //       saveToPhotoAlbum: true,
    //       correctOrientation: true
    //   };
    //   // Get the data of an image
    //   Camera.getPicture(options).then((imageData) => {
    //       this.uploadAttachment(imageData);
    //   }, (error) => {
    //       console.log(error);
    //   });
    // }
    // uploadAttachment(imageData) {
    //   console.log('Attach pressed');
    //   let loading = this.loadingCtrl.create({
    //       content: 'Uploading image...'
    //   });
    //   loading.present();
    //   this.storageS.uploadAttachmentIn(this.chat.id, imageData).then(url => {
    //       this.chatS.sendAttachmentTo(this.user, url).then(url => {
    //           console.log(url);
    //           loading.dismiss();
    //           if (this.user.pushId) {
    //               this.settingsS.fetchUserSettings(this.user).then(settings => {
    //                   if (settings.messages) {
    //                       this.pushS.push(this.userS.user.firstName + " sent an image.", this.user, 'attachment');
    //                   }
    //               }).catch(error => {
    //                   console.log(error);
    //               });
    //           }
    //       }).catch(error => {
    //           console.log(error);
    //           loading.dismiss();
    //       });
    //   }).catch(error => {
    //       console.log(error);
    //       loading.dismiss();
    //   });
    // }
    ChatPage.prototype.getTimeStringFrom = function (timestamp) {
        var date = new Date(timestamp);
        date.setDate(date.getDate());
        var string = date.toString();
        var stringArr = string.split(" ");
        var time = this.tConvert(stringArr[4]);
        var now = new Date();
        var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + " years ago";
        }
        else if (interval == 1) {
            return interval + " year ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        else if (interval == 1) {
            return interval + " month ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            if (interval < 5) {
                var daysAgo = new Date(now);
                daysAgo.setDate(daysAgo.getDate() - interval);
                var string = daysAgo.toString();
                var stringArr = string.split(" ");
                var day = stringArr[0];
                var time = this.tConvert(stringArr[4]);
                return day + ' ' + time;
            }
            else {
                return interval + " days ago";
            }
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return time;
        }
        // interval = Math.floor(seconds / 60);
        // if (interval >= 1) {
        //   return interval + " minutes ago";
        // }
        return time;
    };
    ChatPage.prototype.tConvert = function (time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
            time = time.slice(1); // Remove full string match value
            time[3] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    };
    return ChatPage;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Content */])
], ChatPage.prototype, "content", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Input */])(),
    __metadata("design:type", Object)
], ChatPage.prototype, "project", void 0);
ChatPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-chat',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/details/chat/chat.html"*/'\n<ion-header>\n    <ion-navbar>\n        <img src="assets/chat.png">\n        <ion-title class="title" *ngIf="user">\n            {{ user.firstName }}\n        </ion-title>\n        <ion-title class="title" *ngIf="!user">\n            Chat\n        </ion-title>\n        <ion-buttons end>\n            <button class="exit" ion-fab (click)="dismiss()">\n                <img src="assets/exit.png">\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <p class="alert-text" *ngIf="!messages || messages.length < 1">Hello and welcome to your personal design studio! As soon as you submit your final details, we will connect you with your designer so that you two can chat. The 10 day design period begins once you recieve your initial concept boards. Thank you!</p>\n    <ion-list no-lines>\n        <ion-item *ngFor="let message of messages">\n            <div class="message-header">\n                <img *ngIf="memberMap[message.senderId]" [src]="memberMap[message.senderId].photoURL">\n                <img *ngIf="!memberMap[message.senderId]" src="assets/tmh.png">\n                <h4 *ngIf="memberMap[message.senderId]">{{ memberMap[message.senderId].firstName }}</h4>\n                <h4 *ngIf="!memberMap[message.senderId]">TMH BOT</h4>\n                <p *ngIf="message.createdAtReadable">{{ message.createdAtReadable }}</p>\n            </div>\n            <div *ngIf="message.text" class="message-bubble">\n                <div class="message">{{ message.text }}</div>\n            </div>\n            <div *ngIf="fileMap[message.fileEntryId]" class="img-bubble">\n                <a href="{{ fileMap[message.fileEntryId].url }}" target="_blank"> <!-- cordova: (click)="showImage(fileMap[message.fileEntryId].url)" -->\n                    <img src="{{ fileMap[message.fileEntryId].url }}">\n                </a>\n            </div>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<ion-footer class="chat-footer">\n  <form name="chat-form">\n    <input type="file" accept="image/*" #file (change)="fileChanged($event)" style="visibility:hidden" />\n    <button class="attach" type="button" (click)="file.click()"> <!-- cordova: (click)="presentActionSheet()" -->\n        <img src="assets/attach.png">\n    </button>\n    <div class="chat-message">\n        <ion-textarea type="text" name="chat-message" [(ngModel)]="message.text" placeholder="Enter a message" autocorrect="on"></ion-textarea>\n    </div>\n    <button ion-button class="send" type="button" (click)="send()">\n        SEND\n    </button>\n  </form>\n</ion-footer>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/details/chat/chat.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* ActionSheetController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__providers_chat_service__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_5__providers_image_service__["a" /* ImageService */]])
], ChatPage);

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_project_service__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_image_service__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetailsPage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DetailsPage = (function () {
    function DetailsPage(navCtrl, navParams, userService, projectService, imageService, alertCtrl, popoverCtrl, modalCtrl, platform) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.projectService = projectService;
        this.imageService = imageService;
        this.alertCtrl = alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.modalCtrl = modalCtrl;
        this.platform = platform;
        // Chat vars
        this.false = false;
        this.minimized = false;
        this.maximized = false;
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
        this.loading = true;
        this.view = 'DRAWING';
        this.viewMode = 'CLIENT';
        this.answers = {};
        var self = this;
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
                    self.viewMode = "DESIGNER";
                }
                self.fetchProject();
            }
            else {
                self.navCtrl.setRoot('login');
            }
        });
    }
    DetailsPage.prototype.fetchProject = function () {
        var self = this;
        console.log("fetching projects");
        if (this.navParams.get('project')) {
            self.project = self.navParams.get('project');
            self.project.endDateReadable = self.getDaysLeftStringFrom(self.project.endDate);
            self.fetchDetails();
        }
        else if (this.navParams.get('id')) {
            var id = self.navParams.get('id');
            self.projectService.findByProjectId(id)
                .then(function (project) {
                if (!project['exception']) {
                    self.project = project;
                    self.project.endDateReadable = self.getDaysLeftStringFrom(self.project.endDate);
                    self.fetchDetails();
                }
            });
        }
    };
    DetailsPage.prototype.fetchDetails = function () {
        var self = this;
        console.log("fetching details");
        this.projectService.fetchQuestionAnswers(this.project)
            .then(function (answers) {
            console.log("details page received answers:");
            console.log(answers);
            self.answers = answers;
        });
        this.fetchDrawings();
        this.fetchInspirations();
        this.fetchFurnitures();
    };
    DetailsPage.prototype.fetchDrawings = function () {
        var self = this;
        this.projectService.fetchProjectDetail(this.project.projectId, "DRAWING")
            .then(function (data) {
            console.log("details page received drawings:");
            console.log(data);
            if (!data['exception']) {
                var drawings = [];
                for (var key in data) {
                    var drawing = data[key];
                    drawing.url = self.imageService.createFileUrl(drawing.file);
                    drawings.push(drawing);
                }
                if (drawings.length > 0) {
                    self.status.UPLOADED_DRAWING = true;
                    self.selectedDrawing = drawings[0];
                    self.drawings = drawings;
                }
                else {
                    self.status.UPLOADED_DRAWING = false;
                    self.selectedDrawing = null;
                    self.drawings = null;
                }
                if (self.loading) {
                    self.loading = false;
                }
            }
        });
    };
    DetailsPage.prototype.fetchInspirations = function () {
        var self = this;
        this.projectService.fetchProjectDetail(this.project.projectId, "INSPIRATION")
            .then(function (data) {
            console.log("details page received inspirations:");
            console.log(data);
            if (!data['exception']) {
                var inspirations = [];
                for (var key in data) {
                    var inspiration = data[key];
                    inspiration.url = self.imageService.createFileUrl(inspiration.file);
                    inspirations.push(inspiration);
                }
                if (inspirations.length > 0) {
                    self.status.UPLOADED_INSPIRATION = true;
                    self.selectedInspiration = inspirations[0];
                    self.inspirations = inspirations;
                }
                else {
                    self.status.UPLOADED_INSPIRATION = false;
                    self.selectedInspiration = null;
                    self.inspirations = null;
                }
            }
        });
    };
    DetailsPage.prototype.fetchFurnitures = function () {
        var self = this;
        this.projectService.fetchProjectDetail(this.project.projectId, "FURNITURE")
            .then(function (data) {
            console.log("details page received furnitures:");
            console.log(data);
            if (!data['exception']) {
                var furnitures = [];
                for (var key in data) {
                    var furniture = data[key];
                    furniture.url = self.imageService.createFileUrl(furniture.file);
                    furnitures.push(furniture);
                }
                if (furnitures.length > 0) {
                    self.status.UPLOADED_FURNITURE = true;
                    self.selectedFurniture = furnitures[0];
                    self.furnitures = furnitures;
                }
                else {
                    self.status.UPLOADED_FURNITURE = false;
                    self.selectedFurniture = null;
                    self.furnitures = null;
                }
            }
        });
    };
    DetailsPage.prototype.getDaysLeftStringFrom = function (timestamp) {
        if (timestamp) {
            var date = new Date(timestamp);
            date.setDate(date.getDate());
            var now = new Date();
            var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            var interval = Math.floor(seconds / 86400); // days
            var abs = Math.abs(interval);
            if (interval < 0 && abs == 1)
                return '1 day left';
            if (interval <= 0 && abs >= 0 && abs < 15)
                return abs + ' days left';
            return '';
        }
        else {
            return '';
        }
    };
    DetailsPage.prototype.homePressed = function () {
        console.log("logo pressed");
        this.navCtrl.setRoot('dashboard');
    };
    DetailsPage.prototype.selectTab = function () {
        var _this = this;
        var self = this;
        console.log("toggling tab dropdown");
        var popover = this.popoverCtrl.create('DropdownPage', {
            items: ['DETAILS', 'DESIGN', 'FINAL DELIVERY']
        }, {
            cssClass: 'tab-popover'
        });
        popover.onDidDismiss(function (data) {
            if (data) {
                var page;
                if (data == 'DESIGN')
                    page = 'design';
                if (data == 'FINAL DELIVERY')
                    page = 'final-delivery';
                if (page)
                    _this.navCtrl.setRoot(page, {
                        project: self.project,
                        id: self.project.projectId
                    });
            }
        });
        popover.present();
    };
    DetailsPage.prototype.selectTabLink = function (link) {
        var self = this;
        console.log("selected tab link:");
        console.log(link);
        var page;
        if (link == 'DESIGN')
            page = 'design';
        if (link == 'FINAL_DELIVERY')
            page = 'final-delivery';
        if (page)
            this.navCtrl.setRoot(page, {
                project: self.project,
                id: self.project.projectId
            });
    };
    DetailsPage.prototype.selectDrawing = function (drawing) {
        console.log("thumb pressed for drawing:");
        console.log(drawing);
        this.selectedDrawing = drawing;
    };
    DetailsPage.prototype.selectInspiration = function (inspiration) {
        console.log("thumb pressed for inspiration:");
        console.log(inspiration);
        this.selectedInspiration = inspiration;
    };
    DetailsPage.prototype.selectFurniture = function (furniture) {
        console.log("thumb pressed for furniture:");
        console.log(furniture);
        this.selectedFurniture = furniture;
    };
    DetailsPage.prototype.selectMenuItem = function (item) {
        console.log("menu item pressed:");
        console.log(item);
        this.view = item;
    };
    DetailsPage.prototype.maximizeChat = function () {
        console.log("chat fab pressed for project");
        this.maximized = !this.maximized;
    };
    DetailsPage.prototype.chatToggled = function () {
        console.log("chat toggled");
        this.minimized = !this.minimized;
        if (this.maximized) {
            this.maximized = !this.maximized;
        }
    };
    DetailsPage.prototype.submitToDesigner = function () {
        var self = this;
        console.log("submit to designer pressed");
        var modal = this.modalCtrl.create('ConfirmPage', {
            message: 'Ready to connect with your designer? By selecting the confimation below, your details will be submitted so your designer can begin on your concept boards.'
        });
        modal.onDidDismiss(function (data) {
            console.log(data);
            if (data) {
                self.projectService.updateStatus(self.project, 'DESIGN')
                    .then(function (data) {
                    self.navCtrl.setRoot('design', {
                        project: self.project,
                        id: self.project.projectId
                    });
                });
            }
        });
        modal.present();
    };
    DetailsPage.prototype.fileChanged = function (event) {
        var self = this;
        console.log("file changed:");
        console.log(event.target.files[0]);
        var file = event.target.files[0];
        if (this.view == 'DRAWING') {
            this.projectService.addDetail(this.project, file, 'DRAWING', 'APPROVED')
                .then(function (data) {
                console.log(data);
                if (!data['exception']) {
                    self.fetchDrawings();
                }
            });
        }
        if (this.view == 'INSPIRATION') {
            this.projectService.addDetail(this.project, file, 'INSPIRATION', 'APPROVED')
                .then(function (data) {
                console.log(data);
                if (!data['exception']) {
                    self.fetchInspirations();
                }
            });
        }
        if (this.view == 'FURNITURE') {
            this.projectService.addDetail(this.project, file, 'FURNITURE', 'APPROVED')
                .then(function (data) {
                console.log(data);
                if (!data['exception']) {
                    self.fetchFurnitures();
                }
            });
        }
    };
    DetailsPage.prototype.deleteDetail = function (detail) {
        var _this = this;
        var self = this;
        console.log("delete detail pressed:");
        console.log(detail);
        this.projectService.deleteDetail(this.project, detail)
            .then(function (data) {
            console.log(data);
            if (!data['exception']) {
                if (_this.view == 'DRAWING') {
                    self.fetchDrawings();
                }
                if (_this.view == 'INSPIRATION') {
                    self.fetchInspirations();
                }
                if (_this.view == 'FURNITURE') {
                    self.fetchFurnitures();
                }
            }
        });
    };
    return DetailsPage;
}());
DetailsPage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])({
        name: 'details',
        segment: 'details/:id'
    }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Component */])({
        selector: 'page-details',template:/*ion-inline-start:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/details/details.html"*/'<ion-header [class.maximized]="maximized">\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button (click)="homePressed()">\n        <img style="width:54px;margin:5px;" src="assets/logo.png">\n      </button>\n    </ion-buttons>\n    <ion-title><span *ngIf="project">{{ project.client.firstName }}\'s </span><span *ngIf="project">{{ types[project.projectType] }} Project: </span><span class="page">Design Studio</span></ion-title>\n    <ion-buttons end>\n      <button class="avatar" ion-button menuToggle>\n        <img *ngIf="user && user.photoURL" [src]="user.photoURL">\n        <img *ngIf="!user || !user.photoURL" src="assets/user-placeholder.png">\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n  <div class="sub-nav">\n    <div class="desktop menu">\n      <div><a class="active">1. DETAILS</a></div>\n      <div><a (click)="selectTabLink(\'DESIGN\')">2. DESIGN</a></div>\n      <div><a (click)="selectTabLink(\'FINAL_DELIVERY\')">3. FINAL DELIVERY</a></div>\n    </div>\n    <button class="mobile" ion-button type="button" (click)="selectTab()" full>\n      1. DETAILS\n      <img src="assets/down.png">\n    </button>\n    <div *ngIf="project" class="days-left">\n      {{ project.endDateReadable }}\n    </div>\n  </div>\n</ion-header>\n\n<ion-content [class.minimized]="minimized">\n  <div class="collab-workzone" *ngIf="project">\n    <input type="file" accept="image/*" #file (change)="fileChanged($event)" style="visibility:hidden" />\n    <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>\n    <ion-segment *ngIf="user.admin" [(ngModel)]="viewMode" class="admin-segment">\n      <ion-segment-button value="CLIENT">\n        CLIENT\n      </ion-segment-button>\n      <ion-segment-button value="DESIGNER">\n        DESIGNER\n      </ion-segment-button>\n    </ion-segment>\n    <div class="collab-details-menu-desktop desktop">\n      <div class="menu-item" [class.inactive]="view != \'DRAWING\'" (click)="selectMenuItem(\'DRAWING\')">\n        <img src="assets/drawing.png">\n        <a class="desktop">YOUR ROOM</a>\n      </div>\n      <div class="menu-item" [class.inactive]="view != \'INSPIRATION\'" (click)="selectMenuItem(\'INSPIRATION\')">\n        <img src="assets/inspiration.png">\n        <a class="desktop">INSPIRATION</a>\n      </div>\n      <div class="menu-item" [class.inactive]="view != \'FURNITURE\'" (click)="selectMenuItem(\'FURNITURE\')">\n        <img src="assets/furniture.png">\n        <a class="desktop">EXISTING FURNITURE</a>\n      </div>\n    </div>\n    <button class="chat-fab mobile" ion-fab (click)="maximizeChat()">\n      <img src="assets/chats.png">\n    </button>\n    <div *ngIf="view == \'DRAWING\' && viewMode == \'CLIENT\' && !status.UPLOADED_DRAWING && !loading" class="collab-alert">\n      <h1>WELCOME TO YOUR DESIGN STUDIO!</h1>\n      <p>Please upload pictures of your space and a hand drawn floor plan. The floor plan should be from a birds eye view and include height and width of each wall.</p>\n      <p> Please also include dimensions for doors, windows, or any additional items that could affect the design.</p>\n      <p class="note">( 2 Picture Limit)</p>\n      <button (click)="file.click()" ion-button full type="button">UPLOAD</button>\n    </div>\n    <div *ngIf="view == \'DRAWING\' && viewMode == \'DESIGNER\' && !status.UPLOADED_DRAWING && !loading" class="collab-alert">\n      <h1>WELCOME TO THE DESIGN STUDIO!</h1>\n      <p>Please wait until your client has finished the details phase.</p>\n      <p>Feel free to chat with your client to prepare for the design phase and to help them prepare as well.</p>\n    </div>\n    <div *ngIf="view == \'DRAWING\' && status.UPLOADED_DRAWING" class="collab-image">\n      <img class="selected-img" [src]="selectedDrawing.url">\n      <div class="collab-thumb-wrapper">\n        <div class="collab-thumb" *ngFor="let thumb of drawings">\n          <img class="thumb-img" [src]="thumb.url" [class.active]="thumb.id == selectedDrawing.id" (click)="selectDrawing(thumb)">\n          <img *ngIf="viewMode == \'CLIENT\'" class="delete" src="assets/delete.png" (click)="deleteDetail(thumb)">\n        </div>\n        <div *ngIf="viewMode == \'CLIENT\'" class="collab-thumb">\n          <img class="thumb-img add" src="assets/add.png" (click)="file.click()">\n        </div>\n      </div>\n      <button *ngIf="viewMode == \'CLIENT\' && status.UPLOADED_INSPIRATION && project.projectStatus == \'DETAILS\'" (click)="submitToDesigner()" ion-button full type="button">SUBMIT TO DESIGNER</button>\n    </div>\n    <div *ngIf="view == \'INSPIRATION\' && viewMode == \'CLIENT\' && !status.UPLOADED_INSPIRATION" class="collab-alert">\n      <p>Upload inspiration images that you would like your designer to reference for your space.</p>\n      <button (click)="file.click()" ion-button full type="button">UPLOAD</button>\n    </div>\n    <div *ngIf="view == \'INSPIRATION\' && viewMode == \'DESIGNER\' && !status.UPLOADED_INSPIRATION" class="collab-alert">\n      <p>HANG TIGHT</p>\n      <p>Your client has not uploaded inspiration images yet.</p>\n    </div>\n    <div *ngIf="view == \'INSPIRATION\' && status.UPLOADED_INSPIRATION" class="collab-image">\n      <img class="selected-img" [src]="selectedInspiration.url">\n      <div class="collab-thumb-wrapper">\n        <div class="collab-thumb" *ngFor="let thumb of inspirations">\n          <img class="thumb-img" [src]="thumb.url" [class.active]="thumb.id == selectedInspiration.id" (click)="selectInspiration(thumb)">\n          <img *ngIf="viewMode == \'CLIENT\'" class="delete" src="assets/delete.png" (click)="deleteDetail(thumb)">\n        </div>\n        <div *ngIf="viewMode == \'CLIENT\'" class="collab-thumb">\n          <img class="thumb-img  add" src="assets/add.png" (click)="file.click()">\n        </div>\n      </div>\n      <button *ngIf="viewMode == \'CLIENT\' && status.UPLOADED_DRAWING && project.projectStatus == \'DETAILS\'" (click)="submitToDesigner()" ion-button full type="button">SUBMIT TO DESIGNER</button>\n    </div>\n    <div *ngIf="view == \'FURNITURE\' && viewMode == \'CLIENT\' && !status.UPLOADED_FURNITURE" class="collab-alert">\n      <p>Upload pictures and note measurements of any existing furniture that you would like the designer to incorporate into their designs.</p>\n      <button (click)="file.click()" ion-button full type="button">UPLOAD</button>\n    </div>\n    <div *ngIf="view == \'FURNITURE\' && viewMode == \'DESIGNER\' && !status.UPLOADED_FURNITURE" class="collab-alert">\n      <p>HANG TIGHT</p>\n      <p>Your client has not uploaded existing furniture images yet.</p>\n    </div>\n    <div *ngIf="view == \'FURNITURE\' && status.UPLOADED_FURNITURE" class="collab-image">\n      <img class="selected-img" [src]="selectedFurniture.url">\n      <div class="collab-thumb-wrapper">\n        <div class="collab-thumb" *ngFor="let thumb of furnitures">\n          <img class="thumb-img" [src]="thumb.url" [class.active]="thumb.id == selectedFurniture.id" (click)="selectFurniture(thumb)">\n          <img *ngIf="viewMode == \'CLIENT\'" class="delete" src="assets/delete.png" (click)="deleteDetail(thumb)">\n        </div>\n        <div *ngIf="viewMode == \'CLIENT\'" class="collab-thumb">\n          <img class="thumb-img add" src="assets/add.png" (click)="file.click()">\n        </div>\n      </div>\n      <button *ngIf="viewMode == \'CLIENT\' && status.UPLOADED_DRAWING && status.UPLOADED_INSPIRATION && project.projectStatus == \'DETAILS\'" (click)="submitToDesigner()" ion-button full type="button">SUBMIT TO DESIGNER</button>\n    </div>\n    <div class="collab-details-menu-mobile mobile">\n      <div class="menu-item" [class.inactive]="view != \'DRAWING\'" (click)="selectMenuItem(\'DRAWING\')">\n        <img src="assets/drawing.png">\n      </div>\n      <div class="menu-item" [class.inactive]="view != \'INSPIRATION\'" (click)="selectMenuItem(\'INSPIRATION\')">\n        <img src="assets/inspiration.png">\n      </div>\n      <div class="menu-item" [class.inactive]="view != \'FURNITURE\'" (click)="selectMenuItem(\'FURNITURE\')">\n        <img src="assets/furniture.png">\n      </div>\n    </div>\n    <div class="chat-header desktop" [class.header-minimized]="minimized" [class.header-maximized]="maximized" (click)="chatToggled()">\n      <img class="chat-img" src="assets/chat.png">\n      <h2 class="chat-title">Chat</h2>\n      <img class="chat-minimize" src="assets/down-arrow.png">\n    </div>\n    <page-chat [project]="project" [class.wrapper-minimized]="minimized" [class.wrapper-maximized]="maximized" class="chat-wrapper desktop"></page-chat>\n  </div>\n  <div class="project-details" *ngIf="project">\n    <div class="project-details-wrapper">\n      <h1>Project Details</h1>\n      <div *ngIf="project" class="project-details-box">\n        <div class="project-img">\n          <img src="assets/{{ project.projectType }}.png">\n        </div>\n        <h1>{{ types[project.projectType] }}</h1>\n        <h1 *ngIf="answers[4]">{{ answers[4].answer }}</h1>\n        <h4>Project Notes</h4>\n        <p *ngIf="project.style">Style: {{ project.style }}</p>\n        <p *ngIf="answers[0]">ZIP Code: {{ answers[0].answer }}</p>\n        <p *ngIf="answers[1]">Share your space with: {{ answers[1].answer }}</p>\n        <p *ngIf="answers[2]">Pet friendly options: {{ answers[2].answer }}</p>\n        <p *ngIf="answers[3]">Limited access: {{ answers[3].answer }}</p>\n      </div>\n    </div>\n  </div>\n</ion-content>'/*ion-inline-end:"/Users/manticarodrigo/@manticarodrigo/tmh/tmh-ionic/src/pages/details/details.html"*/
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
], DetailsPage);

//# sourceMappingURL=details.js.map

/***/ })

});
//# sourceMappingURL=1.main.js.map