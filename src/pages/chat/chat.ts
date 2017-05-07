import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, AlertController, LoadingController, NavParams, ViewController, Content } from 'ionic-angular';
// import { Camera, PhotoViewer } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';

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
    text: '',
    createdAt: null,
  }
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private statusBar: StatusBar,
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
              message.createdAtReadable = this.getTimeStringFrom(message.createdAt);
              messageArr.push(message);
            }
          }
          messageArr.sort(function(a, b){
              return a.createdAt-b.createdAt;
          });
          this.messages = messageArr;
          setTimeout(() => {
              this.scrollToBottom();
          }, 1000);
        } else {
          this.messages = null;
        }
      });
      this.socketService.addSubscription('messages', 'new message')
      .subscribe(data => {
        console.log("Component received message : ");
        console.log(data);
        if (data['sender'] != this.userService.currentUser.userId) {
            data['position'] = 'left';
        } else {
            data['position'] = 'right';
        }
        data['createdAtReadable'] = this.getTimeStringFrom(data['createdAt']);
        this.messages.push(data);
        this.scrollToBottom();
      });
    });
  }

  ionViewWillLoad() {
    this.statusBar.styleDefault();
  }

  ionViewWillLeave() {
    this.statusBar.styleLightContent();
  }

  scrollToBottom() {
    console.log("Scrolling to bottom!");
    let dimensions = this.content.getContentDimensions();
    if (this.content) {
      this.content.scrollToBottom(300);
      // this.content.scrollTo(0, dimensions.scrollHeight, 250); //x, y, ms animation speed
    } else {
      console.log("Content not loaded");
    }
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
    this.message.createdAt = new Date().getTime();
    var data = {
      message: this.message,
      room: this.project.projectId
    }
    this.socketService.pubData('messages', 'addMessage', data, function(savedToLocal) {
        console.log('savedToLocal : ', savedToLocal);
        self.message = {
          id: null,
          sender: self.userService.currentUser.userId,
          text: '',
          createdAt: null
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

  getTimeStringFrom(timestamp) {
    let date = new Date(timestamp);
    date.setDate(date.getDate());
    var string = date.toString();
    var stringArr = string.split(" ");
    var time = this.tConvert(stringArr[4]);

    let now = new Date();
    var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    } else if (interval == 1) {
      return interval + " year ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    } else if (interval == 1) {
      return interval + " month ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      if (interval < 5) {
        let daysAgo = new Date(now);
        daysAgo.setDate(daysAgo.getDate() - interval);
        var string = daysAgo.toString();
        var stringArr = string.split(" ");
        var day = stringArr[0];
        var time = this.tConvert(stringArr[4]);
        return day + ' ' + time;
      } else {
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
  }

  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[3] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

}
