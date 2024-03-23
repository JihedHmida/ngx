import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ngxScroll]',
  standalone: true,
})
export class NgxScroll {
  @Input({ required: true }) maxHeight!: string;
  @Input({ required: true }) minHeight!: string;
  @Input() scrollBg: string = '#fff';
  @Input() scrollThumbBg: string = '#d9d9d9';
  @Input() scrollThumbRadius: number = 0;
  @Input() scrollWidth: number = 10;
  @Input() scrollBorder: boolean = false;
  @Output() scrollEndEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private el: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    const element: HTMLElement = this.el.nativeElement as HTMLElement;
    element.classList.add('ngx-slight-scroll');

    if (this.scrollBorder) {
      element.classList.add('ngx-slight-scroll-border');
    }
    if (this.minHeight) {
      this.renderer.setStyle(element, 'minHeight', this.minHeight);
    }
    if (this.maxHeight) {
      this.renderer.setStyle(element, 'maxHeight', this.maxHeight);
    }
    this.renderer.setStyle(this.document.body, '--ngx-slight-scroll-thumb-bg', this.scrollThumbBg);
    this.renderer.setStyle(
      this.document.body,
      '--ngx-slight-scroll-thumb-radius',
      this.scrollThumbRadius.toString() + 'px'
    );
    this.renderer.setStyle(this.document.body, '--ngx-slight-scroll-width', this.scrollWidth.toString() + 'px');
    this.renderer.setStyle(this.document.body, '--ngx-slight-scroll-bg', this.scrollBg);

    if (element) {
      element.addEventListener('scroll', this.scrollHandler.bind(this, element));
    }
  }
  scrollHandler(element: HTMLElement) {
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      this.scrollEndEvent.emit();
    }
  }
}
