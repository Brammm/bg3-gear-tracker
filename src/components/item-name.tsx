import clsx from "clsx";
import type { Item } from "../data/equipment";
import { locations } from "../data/locations";
import { rarityColorMap } from "../data/rarity";

type Props = {
    acquired?: boolean;
    item: Item;
    showLocation?: boolean;
};

export default function ItemName({
    acquired = false,
    item,
    showLocation = true,
}: Props) {
    const act = item.location ? locations.get(item.location) : undefined;

    return (
        <a
            className="inline-flex items-center group"
            href={`https://bg3.wiki/${item.url}`}
            target="_blank"
            rel="noreferrer"
        >
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <span
                className={clsx(
                    "ml-3 truncate",
                    `text-[${rarityColorMap[item.rarity]}]`,
                    acquired
                        ? "line-through group-hover:[text-decoration:underline_line-through]"
                        : "group-hover:underline",
                )}
            >
                {item.name}
            </span>
            {showLocation && item.location && (
                <span className="ml-4 inline-flex items-center rounded-md bg-neutral-700 px-2 py-1 text-xs font-medium text-neutral-400 truncate">
                    {act && `${act}: `}
                    {item.location}
                </span>
            )}
        </a>
    );
}
