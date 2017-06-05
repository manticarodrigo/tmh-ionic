import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-alternatives',
  templateUrl: 'alternatives.html',
})
export class AlternativesPage {
  item: any;
  alts: any;
  selectedFile: any;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.item = this.navParams.get('item');
    this.alts = this.navParams.get('alts');
    for (var key in this.alts) {
      this.alts[key].number = Number(key) + 1;
    }
  }

  savePressed() {
    console.log("save pressed");
    if (this.selectedFile) {
      this.item['file'] = this.selectedFile;
    }
    this.viewCtrl.dismiss(this.item);
  }

  fileChanged(event) {
    console.log("input file changed:");
    const file = event.target.files[0];
    console.log(file);
    this.selectedFile = file;
  }

  validatePrice() {
    var num = this.item['itemPrice'];
    if (num && num.match(/^[0-9]+$/) == null) {
      console.log("num is not numeric");
      console.log(num);
      num = num.slice(0, -1);
    }
    this.item['itemPrice'] = num;
  }

}