import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, AlertController, LoadingController, NavParams, ViewController, Content } from 'ionic-angular';
// import { Camera, PhotoViewer } from 'ionic-native';

import { SocketService } from '../../providers/socket-service';
import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {
  @ViewChild(Content) content: Content;
  project: any;
  messages: any;
  message = {
    id: null,
    sender: null,
    text: ''
  }
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private socketService: SocketService,
              private userService: UserService) {
    this.project = this.navParams.get('project');
    this.socketService.addCollection('messages');
    this.socketService.pubData('messages', 'join', this.project.projectId, (savedToLocal) => {
      console.log('savedToLocal : ', savedToLocal);
      this.socketService.addSubscription('messages', 'messages')
      .subscribe(data => {
        console.log("Component received messages : ");
        console.log(data);
        if (data) {
          var messageArr = [];
          for (var key in data[0]) {
            if (data[0].hasOwnProperty(key) && key != '_id') {
              var message = data[0][key];
              if (message.sender != this.userService.currentUser.userId) {
                  message.position = 'left';
              } else {
                  message.position = 'right';
              }
              messageArr.push(message);
            }
          }
          messageArr.sort(function(a, b){
              return a.createdAt-b.createdAt;
          });
          this.messages = messageArr;
          this.scrollToBottom();
        } else {
          this.messages = null;
        }
      });
      this.socketService.addSubscription('messages', 'new message')
      .subscribe(data => {
        console.log("Component received message : ");
        console.log(data);
      });
    });
  }

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    console.log("Scrolling to bottom!");
    let dimensions = this.content.getContentDimensions();
    this.content.scrollTo(0, dimensions.scrollHeight, 250); //x, y, ms animation speed
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  send() {
    let self = this;
    console.log('in sendMessage and socket is: ', this.socketService.socket);
    if (!this.message.id) {
      this.message.id = Math.ceil(Math.random() * 1000);
    }
    this.message.sender = this.userService.currentUser.userId;
    var data = {
      message: this.message,
      room: this.project.projectId
    }
    this.socketService.pubData('messages', 'addMessage', data, function(savedToLocal) {
        console.log('savedToLocal : ', savedToLocal);
        self.message = {
          id: null,
          sender: this.userService.currentUser.userId,
          text: ''
        };
    });
  }

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

}
