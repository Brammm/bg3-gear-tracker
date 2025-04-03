import clsx from "clsx";
import type { Item } from "../App.tsx";

type Props = {
    item: Item;
};

export default function ItemName({ item }: Props) {
    console.log(item);

    return (
        <div className="flex">
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <span
                className={clsx(
                    "ml-3",
                    item.rarity === "Uncommon" && "text-[#01BD39]",
                    item.rarity === "Rare" && "text-[#01BFFF]",
                    item.rarity === "Very rare" && "text-[#D1017B]",
                    item.rarity === "Legendary" && "text-[#B7861D]",
                    item.rarity === "Story Item" && "text-[#FF5901]",
                )}
            >
                {item.name}
            </span>
        </div>
    );
}
