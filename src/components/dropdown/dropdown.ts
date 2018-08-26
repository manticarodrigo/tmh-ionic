import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'dropdown'
})
@Component({
  selector: 'page-dropdown',
  templateUrl: 'dropdown.html',
})
export class DropdownPage {
  
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
