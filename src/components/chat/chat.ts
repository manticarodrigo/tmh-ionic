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
  selector: 'chat',
  templateUrl: 'chat.html',
})
export class ChatComponent {
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
      });
  }

  observeMessages() {
    this.chatService.observeMessages((data: any) => {
      console.log('chat component received message:', data);
      if (!this.memberMap[data.senderId]) {
       this.addMemberData(data.senderId);
      }
      if (data.createdAt) {
        data.createdAtReadable = this.getTimeStringFrom(data.createdAt);
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
    const dimensions = this.content.getContentDimensions()
    console.log('scrolling to bottom', dimensions);
    if (dimensions) {
      this.content.scrollToBottom(300);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  send() {
    let text = this.message.text.replace(/^\s+/, '').replace(/\s+$/, '');
    if (text !== '') {
        // text has real content
        const msgData = {
          message: {
            text: this.message.text,
            id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
            senderId: this.userService.currentUser.id,
            createdAt: new Date().getTime()
          },
          room: this.project.projectId
        }
        this.chatService.send(msgData, (savedToLocal) => {
          this.message = {
              text: '',
              id: null,
              senderId: this.userService.currentUser.userId,
              createdAt: null
            };
        });
    }
  }

  fileChanged(event) {
    const file = event.target.files[0];
    console.log('file changed:', file);
    const msgData = {
      message: {
        image: file,
        id: this.message.id ? this.message.id : Math.ceil(Math.random() * 1000),
        senderId: this.userService.currentUser.id,
        createdAt: new Date().getTime()
      },
      room: this.project.projectId
    }
    this.chatService.send(msgData, (savedToLocal) => {
      console.log('sent attachment saved:', savedToLocal);
      this.message = {
          text: '',
          id: null,
          senderId: this.userService.currentUser.id,
          createdAt: null
        };
    });
  }

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
