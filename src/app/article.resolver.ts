import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Filter } from './test-article/test-article.component';

export const ArticleResolver: ResolveFn<any> = (route, state) => {
  const http = inject(HttpClient);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    console.log('Browser', 'Resolver');
  } else {
    console.log('Server', 'Resolver');
  }

  const code = route.paramMap.get('code');
  if (!code) {
    console.error('Code parameter is missing in route.');
    return of(null);
  }

  const filter: Filter = {
    where: [{ isreferencingtable: false, table: 'ARTICLE', field: 'CODE', operateur: 'ILIKE', valeur: code }],
  };
  return http
    .post(
      'https://api.app-server.benamorinternational.com/ecommerce/app/elementlist?table=ARTICLE&action=VIEW_LIST',
      filter
    )
    .pipe(
      catchError((error) => {
        console.error('Error fetching article:', error);
        return of(null);
      }),
      map((response: any) => {
        if (response && response.count === 1) {
          return response.data[0];
        } else {
          throw new Error('Count is not equal to one');
        }
      })
    );
};
