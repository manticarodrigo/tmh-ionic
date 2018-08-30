import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { ENV } from '@env';

@Injectable()
export class SocketService {
  observables: any;
  collections: any;
  socket: any;
  isConnectionAlive = false;

  constructor() {
    this.collections = {};
  }

  init() {
    console.log("Initializing sockets...");
    
    this.socket = io.connect(ENV.socketUrl);

    this.socket.on("connect", (msg) => {
      console.log('on connect');
      this.isConnectionAlive = true;
    });

    this.socket.on("reconnecting", (msg) => {
      console.log('on reconnecting');
      this.isConnectionAlive = false;
    });

    this.socket.on("reconnect_error", (msg) => {
      console.log('on reconnect_error');
      this.isConnectionAlive = false;
    });
    
    this.socket.on("reconnect_failed", (msg) => {
      console.log('on reconnect_failed');
      this.isConnectionAlive = false;
    });

    this.socket.on('disconnect', function () {
      console.log('user disconnected');
      this.isConnectionAlive = false;
    });
  }

  addCollection(name) {
    // Create a "Sub-Socket" for each collection
    const _s = io.connect(ENV.socketUrl + '/' + name);
    this.collections[name] = _s;
  }

  addSubscription(coll, name) {
    let self = this;
    let observable = new Observable(observer => {
      self.collections[coll].on(name, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  pubData(collection, endpoint, data, callback) {
      let self = this;
      if (self.isConnectionAlive) {
        console.log("Emitting data at endpoint : " + collection + "/" + endpoint);
        self.collections[collection].emit(endpoint, data);
      } else {
        console.log("Saving data at endpoint to local storage : " + collection + "/" + endpoint);
        this.saveToLocalStorage(collection, {
            "endpoint": endpoint,
            "data": data
        });
      }
      callback(!this.isConnectionAlive);
  }

  saveToLocalStorage(collection, data) {
      const savedData = this.getFromLocalStorage(collection);
      const ls = savedData || [];
      ls.push(data);
      localStorage.setItem(collection, JSON.stringify(ls));
  }

  clearCollection(collection) {
      localStorage.setItem(collection, null);
  }

  getFromLocalStorage(collection) {
      return JSON.parse(localStorage.getItem(collection));
  }

}
