import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  @Input() title: string;
  @Input() tabs: Array<any>;
  @Input() selectedTab: string;
  @Input() tabsMap: any;
  @Input() user: any;
  @Input() project: any;
  @Output() onHomePressed = new EventEmitter();
  @Output() onSelectTab = new EventEmitter();
  @Output() onSelectDropdown = new EventEmitter();

  constructor() {
    console.log(this.tabs);
  }

}
