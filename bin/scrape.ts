import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
import * as cliProgress from "cli-progress";
import { type Item, equipment } from "../src/data/equipment";
import { locations } from "../src/data/locations";
import { type Rarity, rarityColorMap } from "../src/data/rarity";

const REDOWNLOAD_THUMBS = true;

axios.defaults.baseURL = "https://bg3.wiki";

const items: Item[] = [];
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// console.log(await scrapeLocation("/wiki/Amulet_of_the_Absolute"));

console.log("Scraping items");
bar.start(equipment.length, 0);
for await (const type of equipment) {
    for await (const url of type.url) {
        items.push(...(await parseItems(type.name, url)));
    }
    bar.increment();
}
bar.stop();

console.log(`${REDOWNLOAD_THUMBS ? "Downloading" : "Parsing"} thumbnails`);
if (REDOWNLOAD_THUMBS && fs.existsSync("public/thumbs")) {
    fs.rmSync("public/thumbs", { recursive: true });
}
bar.start(items.length, 0);
for await (const item of items) {
    const type = equipment.find((type) => type.name === item.type);
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

console.log("Scraping locations");
bar.start(items.length, 0);
for await (const item of items) {
    item.location = await scrapeLocation(item.url);
    bar.increment();
}
bar.stop();

console.log("Writing items to file");
if (fs.existsSync("src/data/items.ts")) {
    fs.rmSync("src/data/items.ts");
}
fs.writeFileSync(
    "src/data/items.ts",
    `import type { Item } from './equipment';

export const items: Item[] = ${JSON.stringify(items, null, 4)};
`,
);

console.log("Done");

///////////////////////// FUNCTIONS

async function parseItems(type: string, url: string): Promise<Item[]> {
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
                type: type,
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

    if (REDOWNLOAD_THUMBS) {
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
    }

    return decodeName(fullPath);
}

function decodeName(name: string): string {
    return name.replace("public", "").replaceAll("%2B", "+");
}

async function scrapeLocation(url: string): Promise<string | undefined> {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const places: cheerio.Cheerio[] = [];
    $("#Where_to_find")
        .parent()
        .next()
        .find("ul > li")
        .each((_, elem) => {
            places.push($(elem));
        });

    if (!places.length) {
        return undefined;
    }

    // Look for known location first
    for (const place of places) {
        const links: string[] = [];
        place.find("a").each((_, elem) => {
            links.push($(elem).text());
        });

        for (const link of links) {
            if (link === "Adamantine Forge (location)") {
                return "Adamantine Forge";
            }

            if (locations.has(link)) {
                return link;
            }
        }
    }

    // Look for random or trader location
    for (const place of places) {
        const text = place.text();

        if (text.startsWith("Random")) {
            return "Random";
        }

        if (text.startsWith("Sold by")) {
            return "Traders";
        }
    }
}
