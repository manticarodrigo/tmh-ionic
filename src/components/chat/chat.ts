import {
  Component,
  ViewChild,
  Input
} from '@angular/core';

import {
  NavParams,
  ViewController,
  Content
} from 'ionic-angular';

import { ChatService } from '../../providers/chat-service';
import { UserService } from '../../providers/user-service';

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
  };
  memberMap = {};
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private chatService: ChatService,
    private userService: UserService
  ) {
    this.memberMap[this.userService.currentUser.id] = {
      first_name: this.userService.currentUser.first_name,
      image: this.userService.currentUser.image,
      loading: false
    }
    if (this.navParams.get('project')) {
      this.project = this.navParams.get('project');
      console.log('found project for chat:', this.project);
      this.chatService.join(this.project.id);
      this.fetchMessages();
      this.observeMessages();
    }
  }

  ngOnDestroy() {
    if (this.project) {
      this.chatService.leave(this.project.id);
    }
  }

  fetchMessages() {
    this.chatService.fetchMessages()
    .then(data => {
      console.log('chat component received messages:', data);
      if (data) {
        let messageArr = [];
        for (const key in data[0]) {
          if (data[0].hasOwnProperty(key) && key != '_id') {
            const message = data[0][key];
            if (!this.memberMap[message.senderId]) {
              this.addMemberData(message.senderId);
            }
            if (message.createdAt) {
              message.createdAtReadable = this.getTimeStringFrom(message.createdAt);
            }
            messageArr.push(message);
          }
        }
        messageArr.sort(function(a, b){
            return a.createdAt-b.createdAt;
        });
        this.messages = messageArr;
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
      } else {
        this.messages = null;
      }
    })
  }

  observeMessages() {
    this.chatService.observeMessages(data => {
      console.log('chat component received message:', data);
      if (!this.memberMap[data['senderId']]) {
       this.addMemberData(data['senderId']);
      }
      if (data['createdAt']) {
        data['createdAtReadable'] = this.getTimeStringFrom(data['createdAt']);
      }
      this.messages.push(data);
      this.scrollToBottom();
    });
  }

  addMemberData(uid) {
    if (!this.memberMap[uid]) {
      this.memberMap[uid] = { loading: true };
      this.userService.fetchUser(uid)
        .then((user: any) => {
          this.memberMap[uid] = {
            first_name: user.first_name,
            image: user.image,
            loading: false
          }
        });
    }
  }

  scrollToBottom() {
    console.log('scrolling to bottom');
    let dimensions = this.content.getContentDimensions();
    if (this.content.getContentDimensions()) {
      this.content.scrollToBottom(300);
      // this.content.scrollTo(0, dimensions.scrollHeight, 250); //x, y, ms animation speed
    } else {
      console.log('content not loaded');
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
        const msgData = {
          message: {
            text: self.message.text,
            id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
            senderId: this.userService.currentUser.id,
            createdAt: new Date().getTime()
          },
          room: this.project.projectId
        }
        this.chatService.send(msgData, (savedToLocal) => {
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
    console.log('file changed:', event.target.files[0]);
    // this.imageService.uploadFile(event.target.files[0], this.project)
    //   .then(data => {
    //     console.log('chat component received data:', data);
    //     const msgData = {
    //       message: {
    //         fileEntryId: data['fileEntryId'],
    //         id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
    //         senderId: this.userService.currentUser.userId,
    //         createdAt: new Date().getTime()
    //       },
    //       room: this.project.projectId
    //     }
    //     this.chatService.send(msgData, (savedToLocal) => {
    //       this.message = {
    //           text: '',
    //           id: null,
    //           senderId: this.userService.currentUser.userId,
    //           createdAt: null
    //         };
    //     });
    //   });
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
  //                       this.pushS.push(this.userS.user.firstName + ' sent an image.', this.user, 'attachment');
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
    const date = new Date(timestamp);
    date.setDate(date.getDate());
    const string = date.toString();
    const stringArr = string.split(' ');
    const time = this.tConvert(stringArr[4]);

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + ' years ago';
    } else if (interval == 1) {
      return interval + ' year ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + ' months ago';
    } else if (interval == 1) {
      return interval + ' month ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      if (interval < 5) {
        let daysAgo = new Date(now);
        daysAgo.setDate(daysAgo.getDate() - interval);
        const string = daysAgo.toString();
        const stringArr = string.split(' ');
        const day = stringArr[0];
        const time = this.tConvert(stringArr[4]);
        return day + ' ' + time;
      } else {
        return interval + ' days ago';
      }
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return time;
    }
    // interval = Math.floor(seconds / 60);
    // if (interval >= 1) {
    //   return interval + ' minutes ago';
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
