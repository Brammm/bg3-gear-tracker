import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

axios.defaults.baseURL = 'https://bg3.wiki';

type EquipmentType = {
    name: string;
    url?: string;
    thumbnail?: string;
}

async function parseEquipment() {
    const html = await axios.get('/wiki/Equipment');
    const $ = cheerio.load(html.data);
    
    const promises: Promise<EquipmentType>[] = [];
    $('.gallery li > div').each(async (_, elem) => {
        promises.push(parseEquipmentType($, elem));
    });

    return await Promise.all(promises);
}

async function parseEquipmentType($: cheerio.Root, elem: cheerio.Element): Promise<EquipmentType> {
    const link = $('.gallerytext p a', elem);
    const thumb = $('.thumb img', elem);

    const type: EquipmentType = {
        name: link.text(),
        url: link.attr('href'),
    };

    // download thumbnail
    const src = thumb.attr('src');
    if (src) {
        type.thumbnail = await parseThumbnail(src, 'thumbs/equipment/');
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

const equipment = await parseEquipment();

console.log(equipment);
