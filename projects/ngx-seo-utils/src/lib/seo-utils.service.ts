import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoUtilsConfig } from './config';
import { SeoContent } from './seo-content';

@Injectable({
  providedIn: 'root',
})
export class SeoUtilsService {
  private readonly _ = inject(SeoUtilsConfig);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  /**
   * If invoked without any parameters, it defaults to the module's predefined SEO content.
   * @param seoContent
   */
  setSEO(seoContent?: SeoContent): void {
    const content = seoContent ?? this._;

    this.removeAllMetaTags();
    this.setTitle(content.title, content.siteName);
    this.setDescription(content.description);
    this.setUrl(content.appUrl);
    this.setSiteName(content.siteName);
    this.setImage(content.image, content.imageWidth, content.imageHeight, content.imageType);
    this.setType(content.type);
    this.setLocale();
    this.setTwitterCard(content.twitterCard);
  }

  private setTitle(title: string | undefined, siteName: string | undefined): void {
    const _title = title ?? '';
    const _siteName = siteName ?? this._.siteName;
    const titleContent = _title ? `${_title} | ${_siteName}` : _siteName;
    this.titleService.setTitle(titleContent);
    this.metaService.addTag({ property: 'og:title', content: titleContent });
    this.metaService.addTag({ property: 'twitter:title', content: titleContent });
  }

  private setDescription(description: string | undefined = undefined): void {
    this.metaService.addTag({ name: 'description', content: description ?? this._.description });
    this.metaService.addTag({ property: 'og:description', content: description ?? this._.description });
    this.metaService.addTag({ property: 'twitter:description', content: description ?? this._.description });
  }

  private setUrl(url: string | undefined = undefined): void {
    this.metaService.addTag({ property: 'og:url', content: url ?? this._.appUrl });
    this.metaService.addTag({ property: 'twitter:url', content: url ?? this._.appUrl });
  }

  private setSiteName(siteName: string | undefined = undefined): void {
    this.metaService.addTag({ property: 'og:site_name', content: siteName ?? this._.siteName });
  }

  private setImage(
    image: string | undefined = undefined,
    imageWidth: string | undefined = undefined,
    imageHeight: string | undefined = undefined,
    imageType: string | undefined = undefined
  ): void {
    this.metaService.addTag({ property: 'og:image', content: image ?? this._.image });
    this.metaService.addTag({ property: 'twitter:image', content: image ?? this._.image });
    this.metaService.addTag({ property: 'og:image:width', content: imageWidth ?? this._.imageWidth });
    this.metaService.addTag({ property: 'og:image:height', content: imageHeight ?? this._.imageHeight });
    this.metaService.addTag({ property: 'og:image:type', content: imageType ?? this._.imageType });
  }

  private setType(type: string | undefined = undefined): void {
    this.metaService.addTag({ property: 'og:type', content: type ?? this._.type });
  }

  private setLocale(local: string | undefined = undefined): void {
    this.metaService.addTag({ property: 'og:locale', content: local ?? this._.locale });
  }

  private setTwitterCard(type: string | undefined = undefined): void {
    this.metaService.addTag({ name: 'twitter:card', content: type ?? this._.twitterCard });
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
}
