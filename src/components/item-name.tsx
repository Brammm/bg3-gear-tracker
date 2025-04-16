import clsx from "clsx";
import type { Item } from "../data/equipment";
import { locations } from '../data/locations';
import { rarityColorMap } from "../data/rarity";

type Props = {
    item: Item;
};

export default function ItemName({ item }: Props) {
    const act = item.location ? locations.get(item.location) : undefined;

    return (
        <a
            className={clsx(
                "flex group",
                `text-[${rarityColorMap[item.rarity]}]`,
            )}
            href={`https://bg3.wiki/${item.url}`}
            target="_blank"
            rel="noreferrer"
        >
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <span className="ml-3 group-hover:underline">{item.name}</span>
            {item.location && (
                <span className="ml-4 inline-flex items-center rounded-md bg-neutral-700 px-2 py-1 text-xs font-medium text-neutral-400">
                    {act && `${act}: `}
                    {item.location}
                </span>
            )}
        </a>
    );
}
