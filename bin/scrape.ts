import * as fs from "node:fs";
import * as path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
import {
    type EquipmentType,
    type Item,
    type Rarity,
    rarityColorMap,
} from "../src/data/rarity.ts";

axios.defaults.baseURL = "https://bg3.wiki";
const parsedItems: string[] = [];

// Base configuration
const equipment: EquipmentType[] = [
    {
        name: "Amulets",
        url: "/wiki/Amulets",
        thumbnail: "/equipment/120px-Keepsake_Locket_A_Unfaded.png",
        items: [],
    },
    {
        name: "Armour",
        url: "/wiki/Armour",
        thumbnail: "/equipment/120px-Padded_Armour_Unfaded.png",
        items: [],
    },
    {
        name: "Cloaks",
        url: "/wiki/Cloaks",
        thumbnail: "/equipment/120px-Cloak_Long_C_1_Unfaded.png",
        items: [],
    },
    {
        name: "Footwear",
        url: "/wiki/Footwear",
        thumbnail: "/equipment/120px-Boots_Leather_Unfaded.png",
        items: [],
    },
    {
        name: "Headwear",
        url: "/wiki/Headwear",
        thumbnail: "/equipment/120px-Circlet_of_Mental_Anguish_Unfaded.png",
        items: [],
    },
    {
        name: "Handwear",
        url: "/wiki/Handwear",
        thumbnail: "/equipment/120px-Gloves_Metal_Unfaded.png",
        items: [],
    },
    {
        name: "Rings",
        url: "/wiki/Rings",
        thumbnail: "/equipment/120px-Crushers_Ring_Unfaded.png",
        items: [],
    },
    {
        name: "Shields",
        url: "/wiki/Shields",
        thumbnail: "/equipment/120px-Studded_Shield_Unfaded.png",
        items: [],
    },
    {
        name: "Melee Weapons",
        url: "/wiki/List_of_melee_weapons",
        thumbnail: "/equipment/120px-Greataxe_Unfaded.png",
        items: [],
    },
    {
        name: "Ranged Weapons",
        url: "/wiki/List_of_ranged_weapons",
        thumbnail: "/equipment/50px-Longbow_Unfaded_Icon.png",
        items: [],
    },
];

// clean up old files/data
if (fs.existsSync("src/data/equipment.json")) {
    fs.rmSync("src/data/equipment.json");
}
if (fs.existsSync("public/thumbs")) {
    fs.rmSync("public/thumbs", { recursive: true });
}

// loop over equipment types
for await (const type of equipment) {
    console.log(`Parsing ${type.name}`);

    const items = await parseItems(type.url);
    for await (const item of items) {
        item.thumbnail = await downloadThumbnail(
            item.thumbnail,
            `public/thumbs/${type.name}`,
        );
    }

    type.items = items;
}

// write parsed data to file
fs.writeFileSync(
    "src/data/equipment.ts",
    `import type { EquipmentType } from './rarity';

    export const equipment: EquipmentType[] = ${JSON.stringify(equipment, null, 4)}; \n`,
);

console.log("Done");

///////////////////////// FUNCTIONS

async function parseItems(url: string): Promise<Item[]> {
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

            // Don't add item if no url or image or already parsed
            if (!url || parsedItems.includes(url) || !src) {
                return;
            }

            items.push({
                name: link.text().trim(),
                url,
                rarity: parseRarity($, link),
                thumbnail: src,
            });
            parsedItems.push(url);
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
