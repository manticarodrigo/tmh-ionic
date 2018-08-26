import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'alternatives'
})
@Component({
  selector: 'page-alternatives',
  templateUrl: 'alternatives.html',
})
export class AlternativesPage {
  @ViewChild('file') file:ElementRef;
  item: any;
  alts = [];
  files = [];
  clicking = 0;
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.item = this.navParams.get('item');
    const alt = {
      make: '',
      type: '',
      price: '',
      inspiration: ''
    }
    this.alts.push(alt);
    if (this.navParams.get('alts')) {
      this.alts = this.navParams.get('alts');
      if (this.alts.length < 4) {
        this.alts.push(alt);
      }
    }
    for (var key in this.alts) {
      this.alts[key].number = Number(key) + 1;
    }
  }

  addAlts() {
    console.log('add alts pressed');
    this.viewCtrl.dismiss([this.alts, this.files]);
  }

  clickFile(i) {
    console.log('clicking file at index:', i);
    this.clicking = i;
    this.file.nativeElement.click();
  }

  fileChanged(event) {
    console.log('input file changed:', event.target.files[0]);
    const file = event.target.files[0];
    this.files[this.clicking] = file;
  }

  validatePrice() {
    var num = this.item.price;
    if (num && num.match(/^[0-9]+$/) == null) {
      console.log('num is not numeric', num);
      num = num.slice(0, -1);
    }
    this.item.price = num;
  }

}