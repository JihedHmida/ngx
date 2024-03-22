import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { SeoUtilsService } from '../../../projects/ngx-seo-utils/src/public-api';

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

  article: any;
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
    const filter: Filter = {
      where: [{ isreferencingtable: false, table: 'ARTICLE', field: 'CODE', operateur: 'ILIKE', valeur: code }],
    };
    this.http
      .post('https://api.app-server.wellfone.fr/ecommerce/app/elementlist?table=ARTICLE&action=VIEW_LIST', filter)
      .subscribe((res: any) => {
        if (res.count === 1) {
          this.article = res.data[0];
          let image = '';
          if (this.article.ARTICLE_IMAGE && this.article?.ARTICLE_IMAGE.length > 0) {
            image = this.article.ARTICLE_IMAGE[0].IMAGE_URL;
          }
          this.seoService.setSEO({
            title: this.article.NOM,
            description: this.article.NOM,
            image: image,
            keywords: [...this.article.NOM.split(' '), this.article.CODE],
          });
        }
      });
  }
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
