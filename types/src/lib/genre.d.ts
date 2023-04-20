import { Browser } from "puppeteer";
import { AnimeShort } from "../utils/interfaces";
export declare function Genre(browser: Browser, genre: string, page?: number): Promise<AnimeShort[]>;
