import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdditionalRoomPage } from './additional-room';

@NgModule({
  declarations: [
    AdditionalRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(AdditionalRoomPage),
  ],
  exports: [
    AdditionalRoomPage
  ]
})
export class AdditionalRoomPageModule {}
