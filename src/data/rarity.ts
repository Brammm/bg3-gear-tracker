const rarities = [
    "Common",
    "Uncommon",
    "Rare",
    "Very rare",
    "Legendary",
    "Story Item",
] as const;
export type Rarity = (typeof rarities)[number];

export const rarityColorMap: Record<Rarity, string> = {
    Common: "#FFFFFF",
    Uncommon: "#01BD39",
    Rare: "#01BFFF",
    "Very rare": "#D1017B",
    Legendary: "#B7861D",
    "Story Item": "#FF5901",
};

export type EquipmentType = {
    name: string;
    url: string[];
    thumbnail?: string;
    items: Item[];
};

export type Item = {
    name: string;
    url: string;
    rarity: Rarity;
    thumbnail: string;
};
