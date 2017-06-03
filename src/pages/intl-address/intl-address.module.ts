import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntlAddressPage } from './intl-address';

@NgModule({
  declarations: [
    IntlAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(IntlAddressPage),
  ],
  exports: [
    IntlAddressPage
  ]
})
export class IntlAddressPageModule {}
