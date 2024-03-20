//TODO: add titleDelimiter: ' | ',
//TODO: add keywords constructor
//TODO: listen to router changes
//? https://github.com/avivharuzi/ngx-seo/blob/main/packages/ngx-seo/src/lib/ngx-seo.service.ts

export interface SeoContent {
  title: string;
  description: string;
  appUrl?: string;
  siteName?: string;
  image?: string;
  type?: WebsiteType;

  // Image Meta
  imageType?: string;
  imageWidth?: string;
  imageHeight?: string;
  locale?: string;

  // Twitter Meta
  twitterCard?: TwitterCard;
}

export class SeoDefaultContent {
  title: string;
  description: string;
  siteName: string;

  appUrl: string;
  image: string;
  type: WebsiteType;

  // Image Meta
  imageType: string;
  imageWidth: string;
  imageHeight: string;
  locale: string;

  // Twitter Meta
  twitterCard: TwitterCard;

  /**
   * Simple constructs a new SeoDefaultContent object.
   *
   * @param title Title of the web page.
   * @param description Description of the web page.
   * @param siteName Name of the website.
   * @param appUrl URL of the web application.
   * @param image URL of the image representing the web page.
   */
  constructor(title: string, description: string, siteName: string, appUrl: string, image: string);

  /**
   * Full constructs a new SeoDefaultContent object.
   *
   * @param title Title of the web page.
   * @param description Description of the web page.
   * @param siteName Name of the website.
   * @param appUrl URL of the web application.
   * @param image URL of the image representing the web page.
   * @param type Type of the page (default : 'website's).
   * @param imageType Type of the image (default: 'image/jpeg').
   * @param imageWidth Width of the image (default : '400').
   * @param imageHeight Height of the image (default : '300').
   * @param locale Locale of the web page (default : 'fr_FR').
   * @param twitterCard Type of Twitter card to use (default : 'summary_large_image').
   */
  constructor(
    title: string,
    description: string,
    siteName: string,
    appUrl: string,
    image: string,
    type?: WebsiteType,
    imageType?: string,
    imageWidth?: string,
    imageHeight?: string,
    locale?: string,
    twitterCard?: TwitterCard
  ) {
    this.title = title;
    this.description = description;
    this.siteName = siteName;
    this.appUrl = appUrl;
    this.image = image;
    this.type = type || 'website';
    this.imageType = imageType || 'image/jpeg';
    this.imageWidth = imageWidth || '400';
    this.imageHeight = imageHeight || '300';
    this.locale = locale || 'fr_FR';
    this.twitterCard = twitterCard || 'summary_large_image';
  }
}
export type TwitterCard = 'product' | 'summary_large_image' | 'summary';
export type WebsiteType = 'website' | 'blog' | 'profile' | 'product' | 'place';
