import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
import * as cliProgress from "cli-progress";
import { type Rarity, rarityColorMap } from "../src/data/rarity.ts";
import { type Item, equipment } from "../src/data/type.ts";

axios.defaults.baseURL = "https://bg3.wiki";

const items: Item[] = [];

// clean up old files/data
if (fs.existsSync("src/data/equipment.ts")) {
    fs.rmSync("src/data/equipment.ts");
}
if (fs.existsSync("public/thumbs")) {
    fs.rmSync("public/thumbs", { recursive: true });
}

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

console.log("Scraping items");
bar.start(equipment.length, 0);
for await (const type of equipment) {
    for await (const url of type.url) {
        items.push(...(await parseItems(type.url[0], url)));
    }
    bar.increment();
}
bar.stop();

console.log("Downloading thumbnails");
bar.start(items.length, 0);
for await (const item of items) {
    const type = equipment.find((type) => type.url[0] === item.type);
    if (!type) {
        throw new Error(`Couldn't find type for item ${item.name}`);
    }

    item.thumbnail = await downloadThumbnail(
        item.thumbnail,
        `public/thumbs/${type.name}`,
    );
    bar.increment();
}
bar.stop();

// write parsed data to file
fs.writeFileSync(
    "src/data/equipment.ts",
    `import type { Item } from './type';

export const equipment: Item[] = ${JSON.stringify(items, null, 4)};
`,
);

console.log("Done");

///////////////////////// FUNCTIONS

async function parseItems(typeId: string, url: string): Promise<Item[]> {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const items: Item[] = [];
    $("table.wikitable").each((_, table) => {
        $("tbody tr", table).each((_, elem) => {
            const cell = $("td:first", elem);

            const link = $("p > a", cell);
            const thumbnail = $("img", cell);

            const url = link.attr("href");
            const src = thumbnail.attr("src");

            // Don't add item if no url or image, or already added
            if (!url || !src || items.find((item) => item.url === url)) {
                return;
            }

            items.push({
                type: typeId,
                name: link.text().trim(),
                url,
                rarity: parseRarity($, link),
                thumbnail: src,
            });
        });
    });

    return items;
}

function parseRarity($: cheerio.Root, link: cheerio.Cheerio): Rarity {
    const span = $("span", link);

    const styleAttr = span.attr("style") || "";

    const colorMatch = styleAttr.match(/color:\s*([^;]+)/);

    if (colorMatch) {
        const foundColor = colorMatch[1].trim();

        return (
            (Object.entries(rarityColorMap).find(
                ([_, color]) => foundColor === color,
            )?.[0] as Rarity) || "Common"
        );
    }

    return "Common";
}

async function downloadThumbnail(
    src: string,
    basePath: string,
): Promise<string> {
    const filename = path.basename(src);
    const fullPath = path.join(basePath, filename);

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    const response = await axios({
        url: src,
        method: "GET",
        responseType: "stream",
    });

    const writer = fs.createWriteStream(decodeURIComponent(fullPath));
    response.data.pipe(writer);

    return decodeName(fullPath);
}

function decodeName(name: string): string {
    return name.replace("public", "").replaceAll("%2B", "+");
}
