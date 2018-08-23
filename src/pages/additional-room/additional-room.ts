import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';

@IonicPage({
  name: 'additional-room'
})
@Component({
  selector: 'page-additional-room',
  templateUrl: 'additional-room.html',
})
export class AdditionalRoomPage {
  rooms = 1;
  room1: any;
  room2: any;
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
    this.rooms = this.navParams.get('rooms');
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  selected(type) {
    console.log('selected:', type);
    this.room1 = type;
  }

  selectedAlso(type) {
    console.log('selected also:', type);
    this.room2 = type;
  }
  
  continue() {
    console.log('continue pressed');
    if (this.rooms === 1 && this.room1) {
      this.viewCtrl.dismiss({
        room1: this.room1,
        room2: this.room2
      });
    } else if (this.rooms === 2 && this.room1 && this.room2) {
      this.viewCtrl.dismiss({
        room1: this.room1,
        room2: this.room2
      });
    } else if (!this.room1 || !this.room2) {
      let alert = this.alertCtrl.create({
        title: 'Almost there!',
        message: 'Please select additional rooms.',
        buttons: ['DISMISS']
      });
      alert.present();
    }
  }
}
