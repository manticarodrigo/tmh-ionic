import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dropdown',
  templateUrl: 'dropdown.html',
})
export class Dropdown {
  
  items: any;
  

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.items = this.navParams.get('items');
  }

  selectItem(item) {
    this.viewCtrl.dismiss(item);
  }

}
