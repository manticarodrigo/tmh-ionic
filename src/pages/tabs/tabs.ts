import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'Dashboard';
  tab2Root = 'About';
  tab3Root = 'Settings';

  constructor() {

  }
}
