import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, map, mergeMap } from 'rxjs';
import { SeoUtilsConfig } from './config';
import { SeoContent, SeoDefaultContent } from './seo-content';
const DEFAULT_CONTENT = new SeoDefaultContent('Seo Title', 'Seo Description', 'Seo', 'Seo.com', '');
@Injectable({
  providedIn: 'root',
})
export class SeoUtilsService {
  private _: SeoDefaultContent = inject(SeoUtilsConfig, { optional: true }) ?? DEFAULT_CONTENT;
  private routeSub?: Subscription;

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  setGlobalSeo(content: SeoDefaultContent) {
    this._ = content;
    if (this._.listenToRouteEvents) {
      if (this.routeSub) {
        this.routeSub.unsubscribe();
      }
      this.routeSub = this.listenToRouteEvents();
    }
  }

  constructor() {
    if (this._.listenToRouteEvents && !this.routeSub) {
      this.routeSub = this.listenToRouteEvents();
    }
  }

  /**
   * If invoked without any parameters, it defaults to the module's predefined SEO content.
   * @param seoContent
   */
  setSEO(seoContent?: SeoContent): void {
    const content = seoContent ?? this._;
    this.removeAllMetaTags();
    this.setTitle(content.title, content.siteName, content.titleDelimiter);
    this.setDescription(content.description);
    this.setUrl(content.appUrl);
    this.setSiteName(content.siteName);
    this.setImage(content.image, content.imageWidth, content.imageHeight, content.imageType);
    this.setType(content.type);
    this.setLocale();
    this.setTwitterCard(content.twitterCard);
    this.setKeywords(content.keywords);
  }

  private setKeywords(metaKeywords: string | string[] = ''): void {
    const keywordsContent: string = typeof metaKeywords === 'string' ? metaKeywords : metaKeywords.join(', ');
    this.metaService.updateTag({ name: 'keywords', content: keywordsContent });
  }

  private setTitle(title: string | undefined, siteName: string | undefined, titleDelimiter: string = '|'): void {
    const _title = title ?? '';
    const _siteName = siteName ?? this._.siteName;
    const titleContent = _title ? `${_title} ${titleDelimiter} ${_siteName}` : _siteName;
    this.titleService.setTitle(titleContent);
    this.metaService.updateTag({ property: 'og:title', content: titleContent });
    this.metaService.updateTag({ property: 'twitter:title', content: titleContent });
  }

  private setDescription(description: string | undefined = undefined): void {
    this.metaService.updateTag({ name: 'description', content: description ?? this._.description });
    this.metaService.updateTag({ property: 'og:description', content: description ?? this._.description });
    this.metaService.updateTag({ property: 'twitter:description', content: description ?? this._.description });
  }

  private setUrl(url: string | undefined = undefined): void {
    this.metaService.updateTag({ property: 'og:url', content: url ?? this._.appUrl });
    this.metaService.updateTag({ property: 'twitter:url', content: url ?? this._.appUrl });
  }

  private setSiteName(siteName: string | undefined = undefined): void {
    this.metaService.updateTag({ property: 'og:site_name', content: siteName ?? this._.siteName });
  }

  private setImage(
    image: string | undefined = undefined,
    imageWidth: string | undefined = undefined,
    imageHeight: string | undefined = undefined,
    imageType: string | undefined = undefined
  ): void {
    this.metaService.updateTag({ property: 'og:image', content: image ?? this._.image });
    this.metaService.updateTag({ property: 'twitter:image', content: image ?? this._.image });
    this.metaService.updateTag({ property: 'og:image:width', content: imageWidth ?? this._.imageWidth });
    this.metaService.updateTag({ property: 'og:image:height', content: imageHeight ?? this._.imageHeight });
    this.metaService.updateTag({ property: 'og:image:type', content: imageType ?? this._.imageType });
  }

  private setType(type: string | undefined = undefined): void {
    this.metaService.updateTag({ property: 'og:type', content: type ?? this._.type });
  }

  private setLocale(local: string | undefined = undefined): void {
    this.metaService.updateTag({ property: 'og:locale', content: local ?? this._.locale });
  }

  private setTwitterCard(type: string | undefined = undefined): void {
    this.metaService.updateTag({ name: 'twitter:card', content: type ?? this._.twitterCard });
  }

  private removeAllMetaTags(): void {
    this.metaService.removeTag('name="description"');

    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:url"');
    this.metaService.removeTag('property="og:site_name"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:image:width"');
    this.metaService.removeTag('property="og:image:height"');
    this.metaService.removeTag('property="og:image:type"');
    this.metaService.removeTag('property="og:type"');
    this.metaService.removeTag('property="og:locale"');
    // Twitter Meta
    this.metaService.removeTag('name="twitter:card"');
    this.metaService.removeTag('name="twitter:domain"');
    this.metaService.removeTag('name="twitter:url"');
    this.metaService.removeTag('name="twitter:title"');
    this.metaService.removeTag('name="twitter:description"');
    this.metaService.removeTag('name="twitter:image"');
  }

  private listenToRouteEvents(): Subscription {
    return this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map(() => this.findPrimaryRoute(this.activatedRoute)),
        filter((route: ActivatedRoute) => route.outlet === 'primary'),
        mergeMap((route: ActivatedRoute) => route.data)
      )
      .subscribe((data: { seo?: SeoContent }) => {
        if (data.seo) this.setSEO(data.seo);
      });
  }

  private findPrimaryRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
