import { Routes } from '@angular/router';
import { SeoContent } from './../../projects/ngx-seo-utils/src/lib/seo-content';
const seo: SeoContent = { title: 'Seo Route ', description: 'Seo Route' };
const storage: SeoContent = { title: 'Storage Route ', description: 'Storage Route' };
export const routes: Routes = [
  {
    path: 'storage-utils',
    loadComponent: () => import('./storage-utils/storage-utils.component').then((c) => c.StorageUtilsComponent),
    data: { seo: storage },
  },
  {
    path: 'seo-utils',
    loadComponent: () => import('./seo-utils/seo-utils.component').then((c) => c.SeoUtilsComponent),
    data: { seo: seo },
  },
];
