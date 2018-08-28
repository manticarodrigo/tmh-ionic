import { Component, Input } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {
  @Input() user: any;
  @Input() project: any;
  @Input() title: string;

  constructor() {}

}
