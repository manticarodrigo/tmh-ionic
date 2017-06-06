import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from './details';
import { ChatPage } from './chat/chat';

@NgModule({
  declarations: [
    DetailsPage,
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
  ],
  exports: [
    DetailsPage,
    ChatPage
  ]
})
export class DetailsPageModule {}