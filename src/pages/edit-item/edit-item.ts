import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'edit-item'
})
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {
  item: any = {};
  selectedFile: any;
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    const item = this.navParams.get('item');
    if (item) {
      this.item = item;
    }
  }

  savePressed() {
    console.log('save pressed');
    if (this.selectedFile) {
      this.item.image = this.selectedFile;
    }
    this.viewCtrl.dismiss(this.item);
  }

  fileChanged(event) {
    console.log('input file changed:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
  }

  validatePrice() {
    let num = this.item.price;
    if (num && num.match(/^\d*\.?\d*$/) == null) {
      console.log('num is not hundredths decimal', num);
      num = num.slice(0, -1);
    }
    this.item.price = num;
  }

}
