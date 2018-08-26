import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditItemPage } from './edit-item';

@NgModule({
  declarations: [
    EditItemPage,
  ],
  imports: [
    IonicPageModule.forChild(EditItemPage),
  ],
  exports: [
    EditItemPage
  ]
})
export class EditItemPageModule {}
