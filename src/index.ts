import {PuppeteerLaunchOptions, Browser} from "puppeteer";
import {PuppeteerExtra} from "puppeteer-extra";
import { Release } from "./lib/release";
import { Genre } from "./lib/genre";
import { hentai } from "./lib/hentai";
import { search } from "./lib/search";
import { fetch } from "./lib/fetchHentai";
import { fetchEps } from "./lib/fetchEpisode";
import { bypassOuo, bypassOuo2 } from "./utils/bypassOuo";
import { bypassMirrored } from "./utils/bypassMirror";
import { downloadRacaty, extract } from "./utils/DownloadRacaty";
import { DownloadOption, genrelistType } from "./utils/interfaces";
import { genrelist } from "../src/utils/constants";
import chalk from "chalk"
import colors from 'colors'
import figlet from "figlet"
import Spinnies from 'spinnies'
const spinnies = new Spinnies();

export class Client {
  pup: PuppeteerExtra;
  pupBrowser?: Browser;
  opt: PuppeteerLaunchOptions;
  constructor(pups:PuppeteerExtra, options:PuppeteerLaunchOptions={headless: true}) {
    this.pup = pups;
    this.opt = options;
  }

  async start() {
console.log(`[ • NEKOBOI STARTED • ]`)
console.log(`< ================================================== >`) 
console.log(`[•] A simple and lightweight Nekopoi scraper.`)
console.log(`[•] Script Version : 3.0.5`)
console.log(`[•] Repository : https://github.com/wffzy/nekoboi`)
console.log(`[え] Remaked by Ditzzy [え]`)
console.log(`< ================================================== >`)
spinnies.add('spinner-1', { text: 'Client Started, Waiting for a Request....' });
return this.pupBrowser = await this.pup.launch(this.opt);
  }

  async release(page?:number) {
    this.checkInitialize();
    return Release(this.pupBrowser!,page);
  }

  async genre(genre:genrelistType, page?:number) {
    this.checkInitialize();
    if(!genre || genre.length < 1) {
      throw Error("Please input a string")
    }
    return Genre(this.pupBrowser!, genre, page);
  }


  async hentai(page?:number) {
    this.checkInitialize();
    return hentai(this.pupBrowser!,page);
  }

  async search(keyword:string,page?:number) {
    this.checkInitialize();
    if(keyword.length < 3){
      throw Error("Your keyword need to be >3 length")
    }
    return search(this.pupBrowser!,keyword,page);
  }
  
  async fetchHentai(id:string){
    this.checkInitialize();
    if(id.length < 3){
      throw Error("Your id need to be >3 length")
    }
    return fetch(this.pupBrowser!,id)
  }

  async Ouo(url:string,method:number=1){
    this.checkInitialize();
    if(method === 2){
      return bypassOuo2((await this.pupBrowser!.newPage()),url)
    }
    if(url.length < 3){
      throw Error("Your url  need to be >3 length")
    }
    return bypassOuo((url))
  }


  async bypassMirrored(url:string){
    this.checkInitialize();
    if(url.length < 3){
      throw Error("Your url need to be >3 length")
    }
    return bypassMirrored((await this.pupBrowser!.newPage()),url)
  }

  async fetchEpisode(id:string){
    this.checkInitialize();
    if(id.length < 3){
      throw Error("Your id need to be >3 length")
    }
    return fetchEps(this.pupBrowser!,id)
  }
async parseRacaty(url:string) {
    if(!url)throw Error("Please Put Url")
    return await extract(url)
  }
async downloadRacaty(url:string,options:DownloadOption){
    if(!url)throw Error("Please Put Url")
    if(!options)throw Error("Please fileName on the options")
    if(!options.fileName) throw Error("options format is not correct")
    return await downloadRacaty(url,options)
  }
  async close() {
   spinnies.fail('spinner-2', { text: 'Client Stopped' });
    this.checkInitialize();
    return (await this.pupBrowser?.close());
  }

  private checkInitialize() {
    if (this.pupBrowser) {
      return true;
    }
    throw Error("Client is not initialized");
  }
}

// export * from "./utils/interfaces";
