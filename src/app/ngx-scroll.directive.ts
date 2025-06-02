import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Input, Output, PLATFORM_ID, Renderer2, inject, DOCUMENT } from '@angular/core';

@Directive({
  selector: '[ngxScroll]',
  standalone: true,
})
export class NgxScroll {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  @Input({ required: true }) maxHeight!: string;
  @Input({ required: true }) minHeight!: string;
  @Input() scrollBg: string = '#fff';
  @Input() scrollThumbBg: string = '#d9d9d9';
  @Input() scrollThumbRadius: number = 0;
  @Input() scrollWidth: number = 10;
  @Input() scrollBorder: boolean = false;
  @Output() scrollEndEvent: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit(): void {
    const element: HTMLElement = this.elementRef.nativeElement as HTMLElement;

    element.classList.add('ngx-scroll');

    if (this.scrollBorder) {
      element.classList.add('ngx-scroll-border');
    }
    if (this.minHeight) {
      this.renderer.setStyle(element, 'minHeight', this.minHeight);
    }
    if (this.maxHeight) {
      this.renderer.setStyle(element, 'maxHeight', this.maxHeight);
    }

    this.setRootStyles();

    if (element) {
      element.addEventListener('scroll', this.scrollHandler.bind(this, element));
    }
  }

  private setRootStyles(): void {
    // this.document.documentElement or  this.document.body
    const body: HTMLElement = this.document.documentElement;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.setProperty('--ngx-scroll-thumb-bg', this.scrollThumbBg);
      document.body.style.setProperty('--ngx-scroll-thumb-radius', this.scrollThumbRadius.toString() + 'px');
      document.body.style.setProperty('--ngx-scroll-width', this.scrollWidth.toString() + 'px');
      document.body.style.setProperty('--ngx-scroll-bg', this.scrollBg);
    } else {
      this.renderer.setStyle(body, '--ngx-scroll-thumb-bg', this.scrollThumbBg);
      this.renderer.setStyle(body, '--ngx-scroll-thumb-radius', this.scrollThumbRadius.toString() + 'px');
      this.renderer.setStyle(body, '--ngx-scroll-width', this.scrollWidth.toString() + 'px');
      this.renderer.setStyle(body, '--ngx-scroll-bg', this.scrollBg);
    }
  }

  scrollHandler(element: HTMLElement) {
    if (element.offsetHeight + element.scrollTop >= element.scrollHeight) {
      this.scrollEndEvent.emit();
    }
  }
}
