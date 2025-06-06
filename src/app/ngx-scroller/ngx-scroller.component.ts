
import { Component } from '@angular/core';
import { NgxScroll } from '../ngx-scroll.directive';

@Component({
    selector: 'app-ngx-scroller',
    imports: [NgxScroll],
    templateUrl: './ngx-scroller.component.html',
    styles: ``
})
export class NgxScrollerComponent {
  scrollEndEvent(event: any) {
    console.log('Scroll end reached from directive');
  }
}
