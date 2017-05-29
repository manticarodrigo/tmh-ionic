import { Component, ViewChild, Input } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, AlertController, LoadingController, NavParams, ViewController, Content } from 'ionic-angular';
// import { Camera, PhotoViewer } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';

import { ChatService } from '../../providers/chat-service';
import { UserService } from '../../providers/user-service';
import { ImageService } from '../../providers/image-service';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @Input() project: any;
  messages: any;
  message = {
    text: '',
    id: null,
    senderId: null,
    createdAt: null
  }
  members = {}
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private statusBar: StatusBar,
              private chatService: ChatService,
              private userService: UserService,
              private imageService: ImageService) {
    this.members[this.userService.currentUser.userId] = {
      firstName: this.userService.currentUser.firstName,
      photoURL: this.userService.currentUser.photoURL,
      loading: false
    }
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      console.log("found project for chat:");
      console.log(this.project);
      this.chatService.join(this.project.projectId);
      this.fetchMessages();
      this.observeMessages();
    }
  }

  ionViewWillLoad() {
    // this.statusBar.styleDefault();
  }

  ionViewWillLeave() {
    // this.statusBar.styleLightContent();
    if (this.project) {
      this.chatService.leave(this.project.projectId);
    }
  }

  fetchMessages() {
    const self = this;
    this.chatService.fetchMessages()
    .then(data => {
      if (data) {
        var messageArr = [];
        for (var key in data[0]) {
          if (data[0].hasOwnProperty(key) && key != '_id') {
            var message = data[0][key];
            if (!self.members[message.senderId]) {
              self.addMemberData(message.senderId);
            }
            if (message.createdAt) {
              message.createdAtReadable = self.getTimeStringFrom(message.createdAt);
            }
            messageArr.push(message);
          }
        }
        messageArr.sort(function(a, b){
            return a.createdAt-b.createdAt;
        });
        self.messages = messageArr;
        setTimeout(() => {
          self.scrollToBottom();
        }, 500);
      } else {
        self.messages = null;
      }
    })
  }

  observeMessages() {
    const self = this;
    this.chatService.observeMessages(data => {
      if (!self.members[data['senderId']]) {
       self.addMemberData(data['senderId']);
      }
      if (data['createdAt']) {
        data['createdAtReadable'] = this.getTimeStringFrom(data['createdAt']);
      }
      this.messages.push(data);
      this.scrollToBottom();
    });
  }

  addMemberData(uid) {
    const self = this;
    const headers = this.userService.headers;
    if (!this.members[uid]) {
      self.members[uid] = {
        loading: true
      }
      self.userService.fetchUser(uid, (user) => {
        if (!user.exception && user.portraitId) {
          self.imageService.getImage(user.portraitId, headers, (data) => {
              if (data) {
                console.log("Adding photoURL data to chat member map");
                console.log(data);
                var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
                if (data.modifiedDate) {
                  photoURL = photoURL + '&t=' + data.modifiedDate;
                }
                self.members[uid] = {
                  firstName: user.firstName,
                  photoURL: photoURL,
                  loading: false
                }
              } else {
                console.log("No image found");
                self.members[uid] = null;
              }
            });
        } else {
          console.log("Got back object instead of valid user:");
          console.log(user);
          self.members[uid] = null;
        }
      });
    }
  }

  scrollToBottom() {
    console.log("Scrolling to bottom!");
    let dimensions = this.content.getContentDimensions();
    if (this.content.getContentDimensions()) {
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
    let text = this.message.text.replace(/^\s+/, '').replace(/\s+$/, '');
    if (text !== '') {
        // text has real content
        const data = {
          message: {
            text: self.message.text,
            id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
            senderId: this.userService.currentUser.userId,
            createdAt: new Date().getTime()
          },
          room: this.project.projectId
        }
        this.chatService.send(data, (savedToLocal) => {
          self.message = {
              text: '',
              id: null,
              senderId: this.userService.currentUser.userId,
              createdAt: null
            };
        });
    }
  }

  fileChanged(event) {
    console.log("file changed:");
    console.log(event.target.files[0]);
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
