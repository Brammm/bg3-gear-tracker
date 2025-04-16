import { items } from "../src/data/items";
import { locations } from "../src/data/locations";

const itemsWithoutLocation = items
    .filter((item) => !item.location && item.rarity !== "Common")
    .map((item) => item.url);

console.log(`Found items: ${itemsWithoutLocation.length}`);
console.log(itemsWithoutLocation);

const usedLocations = new Set(items.map((item) => item.location));
const allLocations = Array.from(locations.keys());
const unusedLocations = allLocations.filter(
    (location) => !usedLocations.has(location),
);

console.log(`Unused locations: ${unusedLocations.length}`);
console.log(unusedLocations);
