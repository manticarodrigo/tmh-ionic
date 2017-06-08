import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesignPage } from './design';
import { ChatPage } from './chat/chat';

@NgModule({
  declarations: [
    DesignPage,
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(DesignPage),
  ],
  exports: [
    DesignPage,
    ChatPage
  ]
})
export class DesignPageModule {}