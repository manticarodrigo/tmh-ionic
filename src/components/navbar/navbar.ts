import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavController, PopoverController } from 'ionic-angular';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  @Input() title: string;
  @Input() tabs: Array<any>;
  @Input() selectedTab: string;
  @Input() user: any;
  @Input() project: any;
  @Output() onReload = new EventEmitter();

  tabsMap = {
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    DETAILS: '1. DETAILS',
    DESIGN: '2. DESIGN',
    FINAL_DELIVERY: '3. FINAL DELIVERY'
  }
  
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) {}

  homePressed() {
    console.log('logo pressed');
    this.navCtrl.setRoot('dashboard');
  }

  selectDropdown() {
    const activeView = this.navCtrl.getActive().name;
    console.log('toggling tab dropdown', activeView);
    const items = this.tabs.map(item => item.replace('_', ' '));
    const popover = this.popoverCtrl.create(
      'dropdown',
      { items: items }, 
      { cssClass: 'tab-popover'}
    );
    popover.onDidDismiss(data => {
      if (data) {
        if (activeView === 'DashboardPage') {
          this.selectedTab = data.replace(' ', '_');
          this.onReload.emit();
        } else {
          let page: any;
          if (data === 'DETAILS')
            page = 'details';
          if (data === 'FINAL DELIVERY')
            page = 'final-delivery';
          if (page)
            this.navCtrl.setRoot(page, {
              project: this.project,
              id: this.project.id
            });
        }
      }
    });
    popover.present({animate: false});
  }

  selectTab(link) {
    const activeView = this.navCtrl.getActive().name;
    console.log('selected tab link:', link, activeView);
    if (activeView === 'dashboard') {
      this.selectedTab = link;
      this.onReload.emit();
    } else {
      let page: any;

      switch(link) {
        case 'DETAILS':
          page = 'details';
          break;
        case 'DESIGN':
          page = 'design';
          break;
        case 'FINAL_DELIVERY':
          page = 'final-delivery';
          break;
        default:
          break;
      }

      if (!page) return;
      
      this.navCtrl.setRoot(page, {
        project: this.project,
        id: this.project.id
      });
    }
  }

}
