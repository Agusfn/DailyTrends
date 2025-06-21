export interface IFeed {
    _id?: string,
    source: string,
    article_url: string,
    title: string,
    subtitle?: string,
    category?: string,
    location?: string,
    date?: Date,
    main_image_url?: string,
    author_name?: string,
    author_thumbnail_url?: string,
    body_html?: string,
    body_plain_text?: string
}