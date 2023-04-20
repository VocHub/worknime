import { DownloadOption } from "./interfaces";
declare global {
    interface String {
        substringBefore(before: string): string;
        substringAfter(before: string): string;
    }
}
export declare function parse(url: string): Promise<{
    link: string;
    name: string;
}>;
export declare function downloadZippy(url: string, options: DownloadOption): Promise<any>;
