import { Injectable } from '@angular/core';

import { SocketService } from './socket-service';

@Injectable()
export class ChatService {

  constructor(private socketService: SocketService) {
    this.socketService.addCollection('messages');
  }

  join(projectId) {
    this.socketService.pubData('messages', 'join', projectId, (savedToLocal) => {
      console.log('savedToLocal:', savedToLocal);
      console.log('joined chat for project:', projectId);
    });
  }

  leave(projectId) {
    this.socketService.pubData('messages', 'leave', projectId, (savedToLocal) => {
      console.log('savedToLocal:', savedToLocal);
      console.log('left chat for project:', projectId);
    });
  }

  fetchMessages() {
    return new Promise((resolve, reject) => {
      this.socketService.addSubscription('messages', 'messages')
      .subscribe(data => {
        console.log('chat service received messages:', data);
        resolve(data);
      });
    });
  }

  observeMessages(callback) {
    this.socketService.addSubscription('messages', 'new message')
    .subscribe(data => {
      console.log('chat service received message:', data);
      callback(data);
    });
  }

  send(data, callback) {
    this.socketService.pubData('messages', 'addMessage', data, function(savedToLocal) {
        console.log('savedToLocal:', savedToLocal);
    });
  }

}
