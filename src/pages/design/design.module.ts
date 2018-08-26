import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DesignPage } from './design';
import { ChatPageModule } from '../../components/chat/chat.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    DesignPage
  ],
  imports: [
    IonicPageModule.forChild(DesignPage),
    PipesModule,
    ChatPageModule
  ],
  exports: [
    DesignPage
  ]
})
export class DesignPageModule {}