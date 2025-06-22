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
    main_video_url?: string,
    media_caption?: string,
    author_name?: string,
    author_role?: string;   
    author_thumbnail_url?: string,
    body_html?: string,
    body_plain_text?: string,
    is_opinion?: boolean,
    is_premium?: boolean,
    sponsor?: string
}