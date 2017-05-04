import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {

  constructor(private navCtrl: NavController,
              private popoverCtrl: PopoverController) {
  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
    let popover = this.popoverCtrl.create('Dropdown');
    popover.present();
  }

}
