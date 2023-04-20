import { PuppeteerLaunchOptions, Browser } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";
import { DownloadOption, genrelistType } from "./utils/interfaces";
export declare class Client {
    pup: PuppeteerExtra;
    pupBrowser?: Browser;
    opt: PuppeteerLaunchOptions;
    constructor(pups: PuppeteerExtra, options?: PuppeteerLaunchOptions);
    start(): Promise<Browser>;
    release(page?: number): Promise<import("./utils/interfaces").AnimeShort[]>;
    genre(genre: genrelistType, page?: number): Promise<import("./utils/interfaces").AnimeShort[]>;
    hentai(page?: number): Promise<import("./utils/interfaces").AnimeShort[]>;
    search(keyword: string, page?: number): Promise<import("./utils/interfaces").AnimeShort[]>;
    fetchHentai(id: string): Promise<import("./utils/interfaces").HentaiObject>;
    Ouo(url: string, method?: number): Promise<string | null>;
    bypassMirrored(url: string): Promise<import("./utils/interfaces").Mirror[]>;
    fetchEpisode(id: string): Promise<import("./utils/interfaces").Download[]>;
    parseRacaty(url: string): Promise<{
        link: string;
        name: string;
    }>;
    downloadRacaty(url: string, options: DownloadOption): Promise<any>;
    close(): Promise<void | undefined>;
    private checkInitialize;
}
