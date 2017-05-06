import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tab-dropdown',
  templateUrl: 'tab-dropdown.html',
})
export class TabDropdown {
  
  tabs = ['ALL', 'IN PROGRESS', 'COMPLETED', 'ARCHIVED', 'UP NEXT'];
  tabsDict = {
    ALL: 'ALL',
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    ARCHIVED: 'ARCHIVED',
    UP_NEXT: 'UP NEXT'
  }
  

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  selectTab(tab) {
    this.viewCtrl.dismiss(tab);
  }

}
