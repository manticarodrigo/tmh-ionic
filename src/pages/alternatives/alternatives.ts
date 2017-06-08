import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  constructor(private renderer:Renderer,
              private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.item = this.navParams.get('item');
    const alt = {
      itemMake: '',
      itemType: '',
      itemPrice: '',
      itemInspiration: ''
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
    console.log("add alts pressed");
    this.viewCtrl.dismiss([this.alts, this.files]);
  }

  clickFile(i) {
    console.log("clicking file at index:");
    console.log(i);
    this.clicking = i;
    this.file.nativeElement.click();
  }

  fileChanged(event) {
    console.log("input file changed:");
    console.log(event);
    const file = event.target.files[0];
    console.log(file);
    this.files[this.clicking] = file;
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