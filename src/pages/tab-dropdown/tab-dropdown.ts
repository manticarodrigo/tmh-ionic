import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tab-dropdown',
  templateUrl: 'tab-dropdown.html',
})
export class TabDropdown {
  
  tabs: any;
  

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.tabs = this.navParams.get('tabs');
  }

  selectTab(tab) {
    this.viewCtrl.dismiss(tab);
  }

}
