import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

axios.defaults.baseURL = 'https://bg3.wiki';

const rarities = [ 'Common', 'Uncommon', 'Rare', 'Very rare', 'Legendary' ] as const;
type Rarity = typeof rarities[number];

type EquipmentType = {
    name: string;
    url: string;
    thumbnail?: string;
    items: Item[];
}

type Item = {
    name: string;
    // rarity: Rarity;
    thumbnail?: string;
}

async function parseEquipment() {
    const html = await axios.get('/wiki/Equipment');
    const $ = cheerio.load(html.data);

    const promises: Promise<EquipmentType | undefined>[] = [];
    $('.gallery li > div').each(async (_, elem) => {
        promises.push(parseEquipmentType($, elem));
    });

    return (await Promise.all(promises)).filter((type) => type != undefined);
}

async function parseItems(url: string): Promise<Item[]> {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const items: Item[] = [];
    const promises: Promise<Item>[] = [];
    $('table.wikitable').each((_, table) => {
        $('tbody tr', table).each((_, elem) => {
            const cell = $('td:first', elem);
            promises.push(parseItem($, cell, url));
        });
    });
    items.push(...await Promise.all(promises));

    return items;
}

async function parseItem($: cheerio.Root, elem: cheerio.Cheerio, url: string): Promise<Item> {
    const link = $('p > a', elem);
    const thumbnail = $('img', elem);

    const item: Item = {
        name: link.text(),
        // rarity,
    };

    // download thumbnail
    const src = thumbnail.attr('src');
    if (src) {
        item.thumbnail = await parseThumbnail(src, 'thumbs/' + path.basename(url));
    }

    return item;
}

async function parseEquipmentType($: cheerio.Root, elem: cheerio.Element): Promise<EquipmentType | undefined> {
    const link = $('.gallerytext p a', elem);
    const thumbnail = $('.thumb img', elem);

    const url = link.attr('href');

    if (!url) {
        return;
    }

    const type: EquipmentType = {
        name: link.text(),
        url,
        items: await parseItems(url),
    };

    // download thumbnail
    const src = thumbnail.attr('src');
    if (src) {
        type.thumbnail = await parseThumbnail(src, 'thumbs/Equipment/');
    }

    return type;
}

async function parseThumbnail(src: string, basePath: string): Promise<string> {
    const filename = path.basename(src);
    const fullPath = path.join(basePath, filename);

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, {recursive: true});
    }

    const response = await axios({
        url: src,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);

    return fullPath;
}

const items = await parseEquipment();

console.log(items);


// const equipment = await parseEquipment();
//
// console.log(equipment);
