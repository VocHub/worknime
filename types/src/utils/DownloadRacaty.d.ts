import { DownloadOption } from "./interfaces";
declare global {
    interface String {
        substringBefore(before: string): string;
        substringAfter(before: string): string;
    }
}
export declare function extract(url: string): Promise<{
    link: string;
    name: string;
}>;
export declare function downloadRacaty(url: string, options: DownloadOption): Promise<any>;
