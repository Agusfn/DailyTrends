import 'reflect-metadata';
import { readFileSync } from "fs";
import { ElMundoFeedHtmlParserService, ElPaisFeedHtmlParserService, INewsPageFetcher, INewsPageFetcherToken, NewsFeedSyncService } from "../../src/services";
import { IFeedRepository, IFeedRepositoryToken } from "../../src/repositories/feed.repository.interface";
import { join } from "path";
import Container from "typedi";

describe("ElMundoFeedHtmlParserService", () => {

    let newsPageFetcherMock: jest.Mocked<INewsPageFetcher>;
    let feedRepositoryMock: jest.Mocked<IFeedRepository>;
    let newsSyncService: NewsFeedSyncService;
    let date = new Date();

    beforeAll(async () => {

        newsPageFetcherMock = {
            fetchPageHtml: jest.fn().mockImplementation(url => {
                if (url == "https://www.elmundo.es/") {
                    return readFileSync(join(__dirname, '../el-mundo-23-06-2025.html'), 'utf-8')
                } else if (url == "https://elpais.com/") {
                    return readFileSync(join(__dirname, '../el-pais-23-06-2025.html'), 'utf-8')
                }
            })
        };
        Container.set(INewsPageFetcherToken, newsPageFetcherMock);

        feedRepositoryMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createIfNotExists: jest.fn().mockImplementation(async feed => feed as any),
            getOfCurrentDate: jest.fn(),
        };
        Container.set(IFeedRepositoryToken, feedRepositoryMock);

        // Initialize service to be tested
        newsSyncService = Container.get(NewsFeedSyncService);
        newsSyncService.setNewsSitesConfig([
            { url: "https://www.elmundo.es/", HtmlParser: ElMundoFeedHtmlParserService },
            { url: "https://elpais.com/", HtmlParser: ElPaisFeedHtmlParserService }
        ]);

        await newsSyncService.fetchNewsFromAllSites(date);
    });


    describe("NewsFeedSyncService – createIfNotExists calls", () => {
        let calls: any[][];

        beforeAll(() => {
            calls = feedRepositoryMock.createIfNotExists.mock.calls;
        });

        test("Call 0: El Mundo – Juez del Supremo mantiene en libertad al ex ministro Ábalos…", () => {
            expect(calls[0][0]).toEqual({
                source: "el_mundo",
                date: date,
                article_url:
                    "https://www.elmundo.es/espana/2025/06/23/685938e5e4d4d85c528b4576.html",
                title:
                    "El juez del Supremo mantiene en libertad al ex ministro Ábalos y su ex asesor Koldo tras negarse ambos a colaborar con la Justicia",
                category: "Tribunales.",
                location: "Madrid",
                author_name: "ÁNGELA MARTIALAY",
                author_role: undefined,
                main_image_url: undefined,
                media_caption: undefined,
                is_opinion: false,
                is_premium: false,
            });
        });

        test("Call 1: El País – Rutte ve insuficiente el gasto militar…", () => {
            expect(calls[1][0]).toEqual({
                source: "el_pais",
                date: date,
                article_url:
                    "https://elpais.com/espana/2025-06-23/rutte-ve-insuficiente-el-gasto-militar-que-preve-sanchez-y-cree-que-debe-llegar-al-35-del-pib.html",
                title:
                    "Rutte ve insuficiente el gasto militar que prevé Sánchez y cree que debe llegar al 3,5%",
                subtitle:
                    "“La OTAN está convencida de que España debe gastar más”, ha dicho el secretario general de la organización",
                author_name: "Silvia Ayuso",
                location: "La Haya",
                is_premium: true,
            });
        });

        test("Call 4: El Mundo – Sumar examina la \"buena voluntad\" de Sánchez…", () => {
            expect(calls[4][0]).toEqual({
                source: "el_mundo",
                date: date,
                article_url:
                    "https://www.elmundo.es/espana/2025/06/23/685949aee4d4d8217e8b4577.html",
                title:
                    "Sumar examina la \"buena voluntad\" de Sánchez: exige al PSOE dos medidas contra la corrupción antes de su cumbre",
                category: "Coalición.",
                location: "Madrid",
                author_name: "ÁLVARO CARVAJAL",
                is_opinion: false,
                is_premium: false,
            });
        });

        test("Call 9: El Mundo – Rutte corrige a Sánchez y dice que España deberá ir más allá del 2,1%…", () => {
            expect(calls[8][0]).toEqual({
                source: "el_mundo",
                date: date,
                article_url:
                    "https://www.elmundo.es/espana/2025/06/23/68595a5fe85ece732a8b456d.html",
                title:
                    "Rutte corrige a Sánchez y dice que España deberá ir más allá del 2,1% en gasto militar: \"La OTAN está convencida de que tendrá que invertir un 3,5%\"",
                category: "OTAN.",
                location: "La Haya",
                author_name: "DANIEL VIAÑA",
                author_role: "(Enviado Especial)",
                is_opinion: false,
                is_premium: false,
            });
        });

        test("Call 11: El País – En defensa de la democracia, hay que ser socialistas", () => {
            expect(calls[9][0]).toEqual({
                source: "el_pais",
                date: date,
                article_url:
                    "https://elpais.com/opinion/2025-06-23/en-defensa-de-la-democracia-hay-que-ser-socialistas.html",
                title: "En defensa de la democracia, hay que ser socialistas",
                subtitle:
                    "Además de abrazar la ideología ‘woke’, el PSOE se ha sometido a las exigencias de socios enemigos de la Constitución",
                author_name: "Javier Lambán Montañés",
                is_premium: true,
            });
        });

        test("Call 13: El Mundo – El Rey Felipe VI rechaza en Montserrat…", () => {
            expect(calls[12][0]).toEqual({
                source: "el_mundo",
                date: date,
                article_url:
                    "https://www.elmundo.es/cataluna/2025/06/23/68585d99fc6c83ea718b457b.html",
                title:
                    "El Rey Felipe VI rechaza en Montserrat, símbolo de la Iglesia catalana, \"las identidades excluyentes y los totalitarismos\"",
                category: "Cataluña.",
                location: "Monistrol de Montserrat (Barcelona)",
                author_name: "GERARD MELGAR",
                is_opinion: false,
                is_premium: false,
            });
        });

        test("Call 14: El País – Trump dispara la tensión mundial al bombardear Irán", () => {
            expect(calls[13][0]).toEqual({
                source: "el_pais",
                date: date,
                article_url:
                    "https://elpais.com/internacional/2025-06-23/trump-dispara-la-tension-mundial-al-bombardear-iran.html",
                title: "Trump dispara la tensión mundial al bombardear Irán",
                author_name: "Iker Seisdedos",
                location: "Washington",
                main_image_url:
                    "https://imagenes.elpais.com/resizer/v2/O7HEKQGLOHAT4X5UEHWBPGD5LM.jpg?auth=38c6f81165266dd926bb2dc07cf00174a907f27640a37da7c23d286177007b8a&width=414&height=311&focal=2254%2C623",
                is_premium: true,
            });
        });
    });


});