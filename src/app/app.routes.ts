import { Routes } from '@angular/router';
import { SeoContent } from './../../projects/ngx-seo-utils/src/lib/seo-content';
import { ArticleResolver } from './article.resolver';
const seo: SeoContent = { title: 'Seo Route ', description: 'Seo Route' };
const storage: SeoContent = { title: 'Storage Route ', description: 'Storage Route' };
const scroller: SeoContent = { title: 'Scroller Directive ', description: 'Scroller Directive' };
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
  {
    path: 'scroller',
    loadComponent: () => import('./ngx-scroller/ngx-scroller.component').then((c) => c.NgxScrollerComponent),
    data: { seo: scroller },
  },
  {
    path: 'modal',
    loadComponent: () => import('./ngx-modal/ngx-modal.component').then((c) => c.NgxModalComponent),
    data: { seo: scroller },
  },
  {
    path: 'article-detail/:code',
    loadComponent: () => import('./test-article/test-article.component').then((c) => c.TestArticleComponent),

    resolve: { article: ArticleResolver },
  },
  { path: '**', redirectTo: 'storage-utils' },
];
