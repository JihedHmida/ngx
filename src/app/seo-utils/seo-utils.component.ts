
import { Component, inject } from '@angular/core';
import { SeoUtilsService } from '../../../projects/ngx-seo-utils/src/public-api';

@Component({
    selector: 'app-seo-utils',
    imports: [],
    templateUrl: './seo-utils.component.html',
    styles: ``
})
export class SeoUtilsComponent {
  seoUtilsService = inject(SeoUtilsService);

  constructor() {
    this.seoUtilsService.setSEO();
  }
}
