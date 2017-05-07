import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ChatService } from '../../providers/chat-service';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {
  messages: any;
  message: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private chatService: ChatService) {
    this.chatService.addCollection('messages');
    this.chatService.addSubscription('messages', 'allMessages')
    .subscribe(data => {
      console.log("Component received messages : ");
      console.log(data);
      if (data) {
        this.messages = data;
      } else {
        this.messages = null;
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  sendMessage() {
    let self = this;
    console.log('in sendMessage and socket is: ', this.chatService.socket);
    if (!this.message.id) {
      this.message.id = Math.ceil(Math.random() * 1000);
    }
    this.chatService.pubData('messages', 'sendMessage', this.message, function(savedToLocal) {
        console.log('savedToLocal : ', savedToLocal);
        self.message = {
          id: null,
          name: ''
        };
    });
  }

  removeMessage(message) {
    this.chatService.pubData('messages', 'deleteMessage', message, function(savedToLocal) {
        console.log('savedToLocal : ', savedToLocal);
    });
  }

  editMessage(message) {
    this.message = message;
  }

}
