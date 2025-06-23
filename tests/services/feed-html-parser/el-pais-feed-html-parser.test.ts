import { readFileSync } from "fs";
import { ElPaisFeedHtmlParserService } from "../../../src/services/feed-html-parser/el-pais-feed-html-parser.service";
import { join } from "path";
import { IFeed } from "../../../src/models/feed.interface";

describe("ElMundoFeedHtmlParserService", () => {

    let feeds: IFeed[];

    beforeAll(() => {
        const pageHtml = readFileSync(join(__dirname, './el-pais-23-06-2025.html'), 'utf-8');
        const parser = new ElPaisFeedHtmlParserService();
        feeds = parser.parseFrontPage(pageHtml, new Date("2025-06-23T18:30:00.000+02:00"));
    });
    
    test("Articles amount", () => {
        expect(feeds.length).toBe(156);
    });

    describe("Titles", () => {
        test("Some titles", () => {
            expect(feeds[0].title).toBe("Rutte ve insuficiente el gasto militar que prevé Sánchez y cree que debe llegar al 3,5%");
            expect(feeds[5].title).toBe("Israel intensifica su ofensiva con ataques “sin precedentes” sobre Irán");
            expect(feeds[20].title).toBe("El Constitucional avalará la ley de amnistía sin consulta previa a la justicia europea");
            expect(feeds[50].title).toBe("Atlético: épica y ambición para golear al Botafogo");
        });
    });

    describe("Main image URLs", () => {
        test("Articles with and without main images", () => {
            expect(feeds[0].main_image_url).toBeUndefined();
            expect(feeds[5].main_image_url).toBe("https://imagenes.elpais.com/resizer/v2/2PDYXJABG5HR7OXIAEQJFKZ7HU.jpg?auth=c88f07944b1265ba946babda6f58c0e29c1e693958fc1c096372dc9ce4192163&width=414&height=311&smart=true");
            expect(feeds[8].main_image_url).toBe("https://imagenes.elpais.com/resizer/v2/NLXIQFXZXRARLKCW2LEMDSTZGM.jpg?auth=c133e2483a80c9e6e3188e6f76455c9c17bdd3dc36a3bf99c13b052a4dabd944&width=414&height=311&smart=true");
        });
    });

    describe("Authors", () => {
        test("Author names", () => {
            expect(feeds[0].author_name).toBe("Silvia Ayuso");
            expect(feeds[2].author_name).toBe("Reyes Rincón, J. J. Gálvez");
            expect(feeds[5].author_name).toBe("Luis de Vega");
            expect(feeds[12].author_name).toBe("Bernat Coll");
        });
    });

    describe("Locations", () => {
        test("Locations parsed correctly", () => {
            expect(feeds[0].location).toBe("La Haya");
            expect(feeds[1].location).toBe("Kiev");
            expect(feeds[5].location).toBe("Tel Aviv");
            expect(feeds[10].location).toBe("Sevilla");
        });
    });

    describe("Premium flags", () => {
        test("is_premium flags", () => {
            expect(feeds[0].is_premium).toBe(true);
            expect(feeds[2].is_premium).toBe(true);
            expect(feeds[7].is_premium).toBe(false);
            expect(feeds[12].is_premium).toBe(false);
        });
    });

    describe("URLs", () => {
        test("Article URLs start with https", () => {
            [0, 3, 10, 15, 20, 25].forEach(idx => {
                expect(feeds[idx].article_url.startsWith("https://")).toBe(true);
            });
        });
    });

});