import type { Rarity } from "./rarity";

export type Type = {
    name: string;
    url: [string, ...string[]];
    thumbnail?: string;
};

export type Item = {
    type: string; // first type url used as identifier
    name: string;
    url: string;
    rarity: Rarity;
    thumbnail: string;
};

export const equipment: Type[] = [
    {
        name: "Amulets",
        url: ["/wiki/Amulets"],
        thumbnail: "/equipment/120px-Keepsake_Locket_A_Unfaded.png",
    },
    {
        name: "Armour",
        url: ["/wiki/Armour", "/wiki/Clothing"],
        thumbnail: "/equipment/120px-Padded_Armour_Unfaded.png",
    },
    {
        name: "Cloaks",
        url: ["/wiki/Cloaks"],
        thumbnail: "/equipment/120px-Cloak_Long_C_1_Unfaded.png",
    },
    {
        name: "Footwear",
        url: ["/wiki/Footwear"],
        thumbnail: "/equipment/120px-Boots_Leather_Unfaded.png",
    },
    {
        name: "Headwear",
        url: ["/wiki/Headwear"],
        thumbnail: "/equipment/120px-Circlet_of_Mental_Anguish_Unfaded.png",
    },
    {
        name: "Handwear",
        url: ["/wiki/Handwear"],
        thumbnail: "/equipment/120px-Gloves_Metal_Unfaded.png",
    },
    {
        name: "Rings",
        url: ["/wiki/Rings"],
        thumbnail: "/equipment/120px-Crushers_Ring_Unfaded.png",
    },
    {
        name: "Shields",
        url: ["/wiki/Shields"],
        thumbnail: "/equipment/120px-Studded_Shield_Unfaded.png",
    },
    {
        name: "Melee Weapons",
        url: ["/wiki/List_of_melee_weapons"],
        thumbnail: "/equipment/120px-Greataxe_Unfaded.png",
    },
    {
        name: "Ranged Weapons",
        url: ["/wiki/List_of_ranged_weapons"],
        thumbnail: "/equipment/50px-Longbow_Unfaded_Icon.png",
    },
];
