import { readFileSync } from "fs";
import { ElMundoFeedHtmlParserService } from "../../../src/services/feed-html-parser/el-mundo-feed-html-parser.service";
import { join } from "path";
import { IFeed } from "../../../src/models/feed.interface";

describe("ElMundoFeedHtmlParserService", () => {

    let feeds: IFeed[];

    beforeAll(() => {
        const pageHtml = readFileSync(join(__dirname, '../../el-mundo-23-06-2025.html'), 'utf-8');
        const parser = new ElMundoFeedHtmlParserService();
        feeds = parser.parseFrontPage(pageHtml, new Date("2025-06-23T18:30:00.000+02:00"));
    });

    test("Articles amount", () => {
        expect(feeds.length).toBe(48);
    });

    describe('Titles', () => {
        test('First three titles', () => {
            expect(feeds[0].title).toBe("El juez del Supremo mantiene en libertad al ex ministro Ábalos y su ex asesor Koldo tras negarse ambos a colaborar con la Justicia");
            expect(feeds[1].title).toBe("Ábalos se desvincula de los amaños ante el juez y dice que no se reconoce en los audios");
            expect(feeds[2].title).toBe(`Sumar examina la "buena voluntad" de Sánchez: exige al PSOE dos medidas contra la corrupción antes de su cumbre`);
        });
    });

    describe('Main image URLs', () => {
        test('Articles with and without main images', () => {
            expect(feeds[0].main_image_url).toBeUndefined();
            expect(feeds[7].main_image_url).toBe("https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2025/06/23/17506728921789.jpg");
            expect(feeds[8].main_image_url).toBe("https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2025/06/22/17506153520192.jpg");
        });
    });

    describe('Authors', () => {
        test('Author names at various positions', () => {
            expect(feeds[0].author_name).toBe("ÁNGELA MARTIALAY");
            expect(feeds[4].author_name).toBe("DANIEL VIAÑA");
            expect(feeds[16].author_name).toBe("LUCAS DE LA CAL");
        });
    });

    describe('Locations', () => {
        test('Locations parsed correctly', () => {
            expect(feeds[0].location).toBe("Madrid");
            expect(feeds[4].location).toBe("La Haya");
            expect(feeds[8].location).toBe("Estambul");
        });
    });

    describe('Categories', () => {
        test('Categories for selected articles', () => {
            expect(feeds[0].category).toBe("Tribunales.");
            expect(feeds[1].category).toBe("Supremo.");
            expect(feeds[12].category).toBe("Cataluña.");
        });
    });

    describe('Premium and Opinion Flags', () => {
        test('is_premium and is_opinion flags', () => {
            // Non-premium, non-opinion
            expect(feeds[0].is_premium).toBe(false);
            expect(feeds[0].is_opinion).toBe(false);
            // Premium article
            expect(feeds[3].is_premium).toBe(true);
            expect(feeds[3].is_opinion).toBe(false);
            // Opinion article
            expect(feeds[25].is_opinion).toBe(true);
            expect(feeds[25].is_premium).toBe(true);
        });
    });

    describe('Author Roles', () => {
        test('Author role preserved when present', () => {
            expect(feeds[4].author_role).toBe("(Enviado Especial)");
            expect(feeds[17].author_role).toBeUndefined();
        });
    });

    describe('URLs', () => {
        test('Article URLs start with https', () => {
            expect(feeds[0].article_url.startsWith('https://')).toBe(true);
            expect(feeds[14].article_url).toMatch(/^https:\/\//);
        });
    });

});