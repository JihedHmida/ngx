import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { SeoUtilsService } from '../../../projects/ngx-seo-utils/src/public-api';
import { CookiesService, StorageService } from '../../../projects/ngx-storage-utils/src/public-api';

@Component({
  selector: 'app-test-article',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './test-article.component.html',
  styleUrl: './test-article.component.scss',
})
export class TestArticleComponent implements OnInit {
  http = inject(HttpClient);
  seoService = inject(SeoUtilsService);
  platformId = inject(PLATFORM_ID);
  cookiesService = inject(CookiesService);
  storageService = inject(StorageService);

  article: any;
  image = '';
  activeRoute$: Observable<any>;
  constructor(private activatedRoute: ActivatedRoute) {
    this.activeRoute$ = this.activatedRoute.paramMap;
  }
  ngOnInit(): void {
    this.activeRoute$.subscribe((params: ParamMap) => {
      const id = params.get('code');
      let code = id && id != '' ? id : 'error';
      if (code != 'error') {
        console.log(code);
        this.getArticle(code);
      }
    });
  }

  getArticle(code: string) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser', this.cookiesService.get('Cookie'));
      console.log('Browser', this.storageService.getItem('Cookie'));
    } else {
      console.log('Server', this.cookiesService.get('Cookie'));
      console.log('Server', this.storageService.getItem('Cookie'));
    }
    const filter: Filter = {
      where: [{ isreferencingtable: false, table: 'ARTICLE', field: 'CODE', operateur: 'ILIKE', valeur: code }],
    };
    this.http
      .post('https://api.app-server.wellfone.fr/ecommerce/app/elementlist?table=ARTICLE&action=VIEW_LIST', filter)
      .subscribe((res: any) => {
        if (res.count === 1) {
          this.article = res.data[0];
          if (this.article.ARTICLE_IMAGE && this.article?.ARTICLE_IMAGE.length > 0) {
            this.image = getImageSize(this.article.ARTICLE_IMAGE[0].IMAGE_URL, 'medium');
          }
          this.seoService.setSEO({
            title: this.article.NOM,
            description: this.article.NOM,
            image: this.image,
            keywords: [...this.article.NOM.split(' '), this.article.CODE],
          });
        }
      });
  }
}
function getImageSize(imageUrl: string, size: 'small' | 'medium' | 'large'): string {
  return imageUrl.replace('.jpg', `_${size}.jpg`);
}
export interface Filter {
  where: Where[];
}

export interface Where {
  isreferencingtable: boolean;
  table: string;
  field: string;
  operateur: string;
  valeur: string;
}
