import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinalDelivery } from './final-delivery';

@NgModule({
  declarations: [
    FinalDelivery,
  ],
  imports: [
    IonicPageModule.forChild(FinalDelivery),
  ],
  exports: [
    FinalDelivery
  ]
})
export class FinalDeliveryModule {}
