import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'loading',
  priority: 'high'
})
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

}
