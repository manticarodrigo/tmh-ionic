import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {

  constructor(public navCtrl: NavController) {

  }

  toggleDropdown() {
    console.log("Toggling dropdown!");
  }

}
