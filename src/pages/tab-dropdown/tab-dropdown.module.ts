import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabDropdown } from './tab-dropdown';

@NgModule({
  declarations: [
    TabDropdown,
  ],
  imports: [
    IonicPageModule.forChild(TabDropdown),
  ],
  exports: [
    TabDropdown
  ]
})
export class TabDropdownModule {}
