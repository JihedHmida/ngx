import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SeoUtilsService } from '../../../projects/ngx-seo-utils/src/public-api';
import { CookiesService, StorageService } from '../../../projects/ngx-storage-utils/src/public-api';

@Component({
    selector: 'app-test-article',
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './test-article.component.html',
    styleUrl: './test-article.component.scss'
})
export class TestArticleComponent implements OnInit {
  seoService = inject(SeoUtilsService);
  platformId = inject(PLATFORM_ID);
  cookiesService = inject(CookiesService);
  storageService = inject(StorageService);

  article: any;
  image = '';
  activeRouteData$: Observable<any>;
  constructor(private activatedRoute: ActivatedRoute) {
    this.activeRouteData$ = this.activatedRoute.data;
  }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.setArticle(response.article);
    });
  }

  setArticle(data: any) {
    this.article = data;
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
