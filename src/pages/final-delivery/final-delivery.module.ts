import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinalDeliveryPage } from './final-delivery';

@NgModule({
  declarations: [
    FinalDeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(FinalDeliveryPage),
  ],
  exports: [
    FinalDeliveryPage
  ]
})
export class FinalDeliveryPageModule {}