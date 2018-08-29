import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() onHomePressed = new EventEmitter();
  @Output() onSelectTab = new EventEmitter();
  @Output() onSelectDropdown = new EventEmitter();

  tabsMap = {
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    DETAILS: '1. DETAILS',
    DESIGN: '2. DESIGN',
    FINAL_DELIVERY: '3. FINAL DELIVERY'
  }
  
  constructor() {
    console.log(this.tabs);
  }

}
