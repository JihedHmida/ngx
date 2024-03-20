import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'storage-utils',
    loadComponent: () => import('./storage-utils/storage-utils.component').then((c) => c.StorageUtilsComponent),
  },
  {
    path: 'seo-utils',
    loadComponent: () => import('./seo-utils/seo-utils.component').then((c) => c.SeoUtilsComponent),
  },
];
