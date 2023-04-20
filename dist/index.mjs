import cheerio, { load } from 'cheerio';
import axios from 'axios';
import { parse } from 'set-cookie-parser';
import { createWriteStream } from 'fs';
import { Agent } from 'https';
import Spinnies from 'spinnies';

const baseUrl = "https://nekopoi.care";
const Yuumari = "https://yuumari.com/bypass";
const endpoint = {
    release: "/category/hentai/page/$PAGE",
    genre: "/genres/$GENRE/page/$PAGE/",
    search: "/search/$KEYWORD/page/$PAGE",
    detailPage: "/hentai/$ID",
    hentai: "/hentai/page/$PAGE",
    episode: "/$ID"
};
const genrelist = [
    'action',
    'anal',
    'bdsm',
    'blonde',
    'bondage',
    'creampie',
    'dilf',
    'exhibitionist',
    'female monster',
    'Footjob',
    'Furry',
    'Gangbang',
    'Harem',
    'Humilation',
    'Hypnotize',
    'Intercrural',
    'Loli',
    'Male Monster',
    'Megane',
    'Mind Control',
    'Netorare',
    'Old man',
    'Oral',
    'Pantyhose',
    'Prostitution',
    'Romance',
    'Schoolgirl',
    'Sex Toys',
    'Shota',
    'Succubus',
    'Swimsuit',
    'Threesome',
    'Tsundere',
    'Vanilla',
    'Yaoi',
    'Ahegao',
    'Armpit',
    'Big Oppai',
    'Blowjob',
    'Comedy',
    'Dark Skin',
    'Elf',
    'Fellatio',
    'Femdom',
    'Forced',
    'Futanari',
    'Gore',
    'Housewife',
    'Humiliation',
    'Incest',
    'Lactation',
    'Maid',
    'Masturbation',
    'MILF',
    'Monster',
    'Nurse',
    'Onee san',
    'Paizuri',
    'Pregnant',
    'Rape',
    'Saimin',
    'Semi Hentai',
    'Shibari',
    'Stocking',
    'Supranatural',
    'Tentacles',
    'Transsexual',
    'Uncensored',
    'Virgin',
    'Yuri',
];

async function bypass(page, url) {
    try {
        let responseBody;
        let responseData;
        let newResponse;
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.58");
        let response = await page.goto(url, { timeout: 30000, waitUntil: "domcontentloaded" });
        responseBody = await response.text();
        responseData = await response.buffer();
        let tryCount = 0;
        if (!responseBody.includes("Checking your browser")) {
            return { page, responseBody, responseData };
        }
        while (responseBody.includes("Checking your browser") && tryCount <= 10) {
            newResponse = await page.waitForNavigation({ timeout: 30000, waitUntil: "domcontentloaded" });
            if (newResponse)
                response = newResponse;
            responseBody = await response.text();
            responseData = await response.buffer();
            tryCount++;
        }
        return { page, responseBody, responseData };
    }
    catch (error) {
        throw Error("Error");
    }
}

async function Release(browser, page = 1) {
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.release.replace("$PAGE", `${page}`));
    const $ = load(data.responseBody);
    let arr = [];
    $("#content > div.postsbody > div.result > ul > li > div").each((i, el) => {
        let url = $(el).find("h2 > a").first().attr("href");
        let thumb = $(el).find("div.limitnjg > img").first().attr("src");
        let type = $(el).find("h2 > a").first().attr("href").includes("/hentai/") ? "hentai" : "episode";
        let title = $(el).find("h2 > a").first().text();
        let id = "";
        if (type === "hentai") {
            id = url.split("/hentai/")[1];
        }
        else {
            id = url.split(`${baseUrl}/`)[1];
        }
        arr.push({ type, url, thumb, title, id });
    });
    return arr;
}

async function Genre(browser, genre, page = 1) {
    genre = genre.trim().toLowerCase();
    const lowercaseGenrelist = genrelist.map(g => g.toLowerCase());
    if (!lowercaseGenrelist.includes(genre)) {
        throw Error("No Genre Found!");
    }
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.genre.replace("$GENRE", `${genre}`).replace("$PAGE", `${page}`));
    const $ = load(data.responseBody);
    let arr = [];
    $("#content > div.postsbody > div.result > ul > li > div").each((i, el) => {
        let url = $(el).find("h2 > a").first().attr("href");
        let thumb = $(el).find("div.limitnjg > img").first().attr("src");
        let type = $(el).find("h2 > a").first().attr("href").includes("/hentai/") ? "hentai" : "episode";
        let title = $(el).find("h2 > a").first().text();
        let id = "";
        if (type === "hentai") {
            id = url.split("/hentai/")[1];
        }
        else {
            id = url.split(`${baseUrl}/`)[1];
        }
        arr.push({ type, url, thumb, title, id });
    });
    return arr;
}

async function hentai(browser, page = 1) {
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.hentai.replace("$PAGE", `${page}`));
    const $ = load(data.responseBody);
    let arr = [];
    $("#content > div.postsbody > div.result > ul > li > div").each((i, el) => {
        let url = $(el).find("h2 > a").first().attr("href");
        let thumb = $(el).find("div.limitnjg > img").first().attr("src");
        let type = $(el).find("h2 > a").first().attr("href").includes("/hentai/") ? "hentai" : "episode";
        let id = "";
        if (type === "hentai") {
            id = url.split("/hentai/")[1];
        }
        else {
            id = url.split(`${baseUrl}/`)[1];
        }
        let title = $(el).find("h2 > a").first().text();
        arr.push({ type, url, thumb, title, id });
    });
    return arr;
}

async function search(browser, keyword, page = 1) {
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.search.replace("$PAGE", `${page}`).replace("$KEYWORD", keyword));
    const $ = load(data.responseBody);
    let arr = [];
    $("#content > div.postsbody > div.result > ul > li > div").each((i, el) => {
        let url = $(el).find("h2 > a").first().attr("href");
        let type = $(el).find("h2 > a").first().attr("href").includes("/hentai/") ? "hentai" : "episode";
        let thumb = $(el).find("div.limitnjg > img").first().attr("src");
        let title = $(el).find("h2 > a").first().text();
        let id = "";
        if (type === "hentai") {
            id = url.split("/hentai/")[1];
        }
        else {
            id = url.split(`${baseUrl}/`)[1];
        }
        arr.push({ type, url, thumb, title, id });
    });
    return arr;
}

async function fetch(browser, ID) {
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.detailPage.replace("$ID", ID));
    const $ = load(data.responseBody);
    let obj = {};
    $("#content > div.animeinfos > div.listinfo > ul > li").each((i, el) => {
        let key = $(el).text().split(":")[0].replaceAll(" ", "").toLowerCase() || "";
        let val = $(el).text().split(":")[1].replaceAll(" ", "");
        if (key === "genres") {
            obj[key] = val.split(",");
        }
        else {
            obj[key] = val;
        }
    });
    obj["episodeList"] = [];
    $("#content > div.animeinfos > div.episodelist > ul > li").each((i, el) => {
        let title = $(el).find(".leftoff").text();
        let link = $(el).find(".leftoff > a").attr("href");
        let id = $(el).find(".leftoff > a").attr("href")?.split(baseUrl)[1].replace("/", "");
        let date = $(el).find(".rightoff").text();
        obj.episodeList.push({
            title, date, link, id
        });
    });
    obj["thumb"] = $("#content > div.animeinfos > div.imgdesc > img").attr("src");
    return obj;
}

async function fetchEps(browser, ID) {
    const data = await bypass((await browser.newPage()), baseUrl + endpoint.episode.replace("$ID", ID));
    const $ = load(data.responseBody);
    let arr = [];
    $("#content > div.postsbody > div > div.arealinker > div.boxdownload > div").each((i, el) => {
        let title = $(el).find(".name").text();
        let list = [];
        $(el).find(".listlink > p > a").each((i, el) => {
            let provider = $(el).text();
            let link = $(el).attr("href");
            list.push({ provider, link });
        });
        arr.push({ title, list });
    });
    return arr;
}

async function bypassOuo2(page, url) {
    await page.goto(Yuumari, { waitUntil: "networkidle2" });
    await page.waitForSelector('#main > div.bypass-container.svelte-1emk765 > div.content-main.svelte-1emk765 > div:nth-child(1) > div > div.src-box.svelte-1emk765 > textarea');
    await page.focus('#main > div.bypass-container.svelte-1emk765 > div.content-main.svelte-1emk765 > div:nth-child(1) > div > div.src-box.svelte-1emk765 > textarea');
    await page.keyboard.type(url);
    await page.waitForXPath("/html/body/main/div[1]/div[2]/div[1]/div/div[2]/ul/li[2]/button", { timeout: 3000 });
    let elButton2 = await page.$x('/html/body/main/div[1]/div[2]/div[1]/div/div[2]/ul/li[2]/button');
    elButton2[0].click();
    await page.waitForSelector('div.result > ul > li > div');
    await page.waitForFunction('document.querySelector("div.result > ul > li > div").textContent.trim().length > 5');
    let element = await page.$('div.result > ul > li > div');
    let value = await page.evaluate(el => el.textContent, element);
    await page.close();
    return value;
}
async function get(url, i) {
    if (!i) {
        i = 1;
    }
    if (i > 3) {
        return "ERROR";
    }
    try {
        if (url.includes("/go/"))
            url = url.replace("/go/", "/");
        if (url.includes("/fbc/"))
            url = url.replace("/fbc/", "/");
        let header = {};
        let resp = await axios.get(url);
        let $ = load(resp.data);
        let post = $("form[method='POST']").attr("action");
        let tk = $("input[name='_token']").attr("value");
        let cookie = cookieString(parse(resp.headers["set-cookie"]));
        let body = `_token=${tk}&x-token=&v-token=bx`;
        header["Cookie"] = cookie;
        header["Content-Type"] = "application/x-www-form-urlencoded";
        header["Content-Length"] = byteCount(body);
        header["Referer"] = url;
        header["Sec-Fetch-Dest"] = "document";
        header["Sec-Fetch-Mode"] = "navigate";
        header["Sec-Fetch-Site"] = "same-origin";
        header["TE"] = "trailers";
        try {
            const resp = await axios({
                method: 'POST',
                url: post.replace('/go', '/xreallcygo'),
                data: body,
                headers: header,
                maxRedirects: 0,
            });
            if (resp.data) {
                return (await get(url));
            }
        }
        catch (err) {
            if (err.response?.headers?.location)
                return err.response.headers.location;
        }
    }
    catch (err) {
        if (err.code === "ERR_BAD_REQUEST") {
            i++;
            return await get(url, i);
        }
        return err;
    }
}
function cookieString(co) {
    let s = ``;
    for (let c in co) {
        if (co[c].value == "deleted")
            continue;
        s = `${s} ${co[c].name}=${encodeURIComponent(co[c].value)};`;
    }
    s = s.substring(0, s.length - 1);
    return s.substring(1);
}
async function bypassOuo(url) {
    return (await get(url));
}
function byteCount(string) {
    return encodeURI(string).split(/%..|./).length - 1;
}

async function bypassMirrored(page, url) {
    try {
        let id = url.split("/files/")[1].split("/")[0];
        let res = await axios.get(`https://www.mirrored.to/downlink/${id}`);
        let $ = load(res.data);
        let redirect = $("body > div.container.dl-width > div > div > a").attr("href");
        res = await axios.get(redirect);
        let apiRequest = res.data.split('ajaxRequest.open("GET", "')[1].split('", true);')[0];
        res = await axios.get("https://mirrored.to" + apiRequest);
        let new$ = load(res.data);
        let arr = [];
        new$("tr").each((i, el) => {
            let host = $(el).find("img").first().attr("alt");
            let url = $(el).find(".get_btn").parent().attr("href");
            let status = $(el).find("td:nth-child(4)").text();
            status = status.trim();
            if (!host)
                return;
            arr.push({ host, url, status });
        });
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element.url) {
                let newUrl = await getLink(element.url);
                arr[i].url = newUrl;
            }
        }
        return arr;
    }
    catch (error) {
        console.log(`Error on ${url}`);
        throw url;
    }
}
async function getLink(url) {
    let res = await axios.get("https://mirrored.to" + url);
    let $ = load(res.data);
    return $("code").text();
}

const agent = new Agent({
    rejectUnauthorized: false,
});
String.prototype.substringBefore = function (before) {
    return this.substring(0, this.indexOf(before));
};
String.prototype.substringAfter = function (after) {
    return this.substring(this.indexOf(after) + after.length, this.length);
};
async function extract(url) {
    const domain = new URL(url);
    let exte = domain.hostname.split('.')[1];
    url = url.replace(exte, "io").replace("http://", "https://");
    const headers = {
        'referer': 'https://racaty.io',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
        'accept': 'application/json'
    };
    let _id = domain.pathname.split('/')[1];
    const payload = 'op=download2&id=' + _id + '&rand=&referer=&method_free=&method_premium=';
    const response = await axios.post(url, payload, { headers });
    const $ = cheerio.load(response.data);
    const link = $('#uniqueExpirylink').attr('href').replace(' ', '%20');
    const name = /\/\/.*\/.*\/(.*)/.exec(link)[1];
    return { link, name };
}
async function downloadRacaty(url, options) {
    const { data } = await axios.get(url, {
        responseType: "stream",
        httpsAgent: agent,
    });
    const writeStream = createWriteStream(`${options.fileName}`);
    data.pipe(writeStream);
    return data;
}

const spinnies = new Spinnies();
class Client {
    pup;
    pupBrowser;
    opt;
    constructor(pups, options = { headless: true }) {
        this.pup = pups;
        this.opt = options;
    }
    async start() {
        console.log(`[ • NEKOBOI STARTED • ]`);
        console.log(`< ================================================== >`);
        console.log(`[•] A simple and lightweight Nekopoi scraper.`);
        console.log(`[•] Script Version : 3.0.5`);
        console.log(`[•] Repository : https://github.com/wffzy/nekoboi`);
        console.log(`[え] Remaked by Ditzzy [え]`);
        console.log(`< ================================================== >`);
        spinnies.add('spinner-1', { text: 'Client Started, Waiting for a Request....' });
        return this.pupBrowser = await this.pup.launch(this.opt);
    }
    async release(page) {
        this.checkInitialize();
        return Release(this.pupBrowser, page);
    }
    async genre(genre, page) {
        this.checkInitialize();
        if (!genre || genre.length < 1) {
            throw Error("Please input a string");
        }
        return Genre(this.pupBrowser, genre, page);
    }
    async hentai(page) {
        this.checkInitialize();
        return hentai(this.pupBrowser, page);
    }
    async search(keyword, page) {
        this.checkInitialize();
        if (keyword.length < 3) {
            throw Error("Your keyword need to be >3 length");
        }
        return search(this.pupBrowser, keyword, page);
    }
    async fetchHentai(id) {
        this.checkInitialize();
        if (id.length < 3) {
            throw Error("Your id need to be >3 length");
        }
        return fetch(this.pupBrowser, id);
    }
    async Ouo(url, method = 1) {
        this.checkInitialize();
        if (method === 2) {
            return bypassOuo2((await this.pupBrowser.newPage()), url);
        }
        if (url.length < 3) {
            throw Error("Your url  need to be >3 length");
        }
        return bypassOuo((url));
    }
    async bypassMirrored(url) {
        this.checkInitialize();
        if (url.length < 3) {
            throw Error("Your url need to be >3 length");
        }
        return bypassMirrored((await this.pupBrowser.newPage()), url);
    }
    async fetchEpisode(id) {
        this.checkInitialize();
        if (id.length < 3) {
            throw Error("Your id need to be >3 length");
        }
        return fetchEps(this.pupBrowser, id);
    }
    async parseRacaty(url) {
        if (!url)
            throw Error("Please Put Url");
        return await extract(url);
    }
    async downloadRacaty(url, options) {
        if (!url)
            throw Error("Please Put Url");
        if (!options)
            throw Error("Please fileName on the options");
        if (!options.fileName)
            throw Error("options format is not correct");
        return await downloadRacaty(url, options);
    }
    async close() {
        spinnies.fail('spinner-2', { text: 'Client Stopped' });
        this.checkInitialize();
        return (await this.pupBrowser?.close());
    }
    checkInitialize() {
        if (this.pupBrowser) {
            return true;
        }
        throw Error("Client is not initialized");
    }
}
// export * from "./utils/interfaces";

export { Client };
