import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntlAddress } from './intl-address';

@NgModule({
  declarations: [
    IntlAddress,
  ],
  imports: [
    IonicPageModule.forChild(IntlAddress),
  ],
  exports: [
    IntlAddress
  ]
})
export class IntlAddressModule {}
