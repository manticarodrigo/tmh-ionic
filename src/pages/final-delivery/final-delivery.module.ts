import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinalDeliveryPage } from './final-delivery';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    FinalDeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(FinalDeliveryPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    FinalDeliveryPage
  ]
})
export class FinalDeliveryPageModule {}