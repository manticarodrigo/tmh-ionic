import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {
  user: any;
  items: any;
  itemMap: any;
  selectedItems: any;
  cartTotal = 0;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private userService: UserService) {
  }



}