import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CookiesService, StorageService } from '../../../projects/ngx-storage-utils/src/public-api';

@Component({
  selector: 'app-storage-utils',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storage-utils.component.html',
  styles: ``,
})
export class StorageUtilsComponent {
  platformId = inject(PLATFORM_ID);
  cookiesService = inject(CookiesService);
  storageService = inject(StorageService);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser', this.cookiesService.get('Cookie'));
      console.log('Browser', this.storageService.getItem('Cookie'));
    } else {
      console.log('Server', this.cookiesService.get('Cookie'));
      console.log('Server', this.storageService.getItem('Cookie'));
    }

    this.storageService.setItem('encrypt', '123456789', {
      encryptionKey: 'ABC',
    });

    console.log(this.storageService.getItem('encrypt', 'ABC', false));
  }
}
