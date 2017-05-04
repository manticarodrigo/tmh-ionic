import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Dropdown } from './dropdown';

@NgModule({
  declarations: [
    Dropdown,
  ],
  imports: [
    IonicPageModule.forChild(Dropdown),
  ],
  exports: [
    Dropdown
  ]
})
export class DropdownModule {}
