import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CookiesService, StorageService } from '../../../projects/ngx-storage-utils/src/public-api';

@Component({
    selector: 'app-storage-utils',
    imports: [],
    templateUrl: './storage-utils.component.html',
    styles: ``
})
export class StorageUtilsComponent {
  platformId = inject(PLATFORM_ID);
  cookiesService = inject(CookiesService);
  storageService = inject(StorageService);

  constructor() {
    this.cookiesService.set('Cookie', 'Cookie');
    this.storageService.setItem('Cookie', 'Cookie');

    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser', this.cookiesService.get('Cookie'));
      console.log('Browser', this.storageService.getItem('Cookie'));
    } else {
      console.log('Server', this.cookiesService.get('Cookie'));
      console.log('Server', this.storageService.getItem('Cookie'));
    }

    // this.storageService.setItem('encrypt', 1234, {
    //   encryptionKey: 'ABC',
    // });

    // this.cookiesService.set('test', '123456789', { encryptionKey: 'ABC' });
    // this.cookiesService.set('testx', '123456789', { maxAge: 5 });

    // console.log(this.cookiesService.get('test', 'ABCx'));
    // console.log(this.cookiesService.get('testx', 'a'));
    // console.log(this.cookiesService.getAll());

    // console.log('cookies : ', this.cookiesService.get('testx'));

    // console.log(this.storageService.getItem('aa'));
    // console.log(this.storageService.getItem('bb'));

    // console.log(this.cookiesService.get('test'));
    // console.log(this.cookiesService.get('testx'));
  }
}
