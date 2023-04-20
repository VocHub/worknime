import { Page } from "puppeteer";
import { Mirror } from "./interfaces";
export declare function bypassMirrored(page: Page, url: string): Promise<Mirror[]>;
export declare function getLink(url: string): Promise<string>;
