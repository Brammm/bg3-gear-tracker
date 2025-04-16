import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
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

// loop over equipment types
for await (const type of equipment) {
    console.log(`Parsing ${type.name}`);

    for await (const url of type.url) {
        const tempItems = await parseItems(type.url[0], url);
        for await (const item of tempItems) {
            item.thumbnail = await downloadThumbnail(
                item.thumbnail,
                `public/thumbs/${type.name}`,
            );
        }
        items.push(...tempItems);
    }
}

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
