import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdditionalRoom } from './additional-room';

@NgModule({
  declarations: [
    AdditionalRoom,
  ],
  imports: [
    IonicPageModule.forChild(AdditionalRoom),
  ],
  exports: [
    AdditionalRoom
  ]
})
export class AdditionalRoomModule {}
