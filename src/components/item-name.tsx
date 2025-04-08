import clsx from "clsx";
import type { Item } from "../App.tsx";

type Props = {
    addLink?: boolean;
    item: Item;
};

export default function ItemName({ item, addLink = false }: Props) {
    const Wrapper = addLink ? "a" : "span";

    return (
        <div className="flex">
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <Wrapper
                className={clsx(
                    "ml-3",
                    item.rarity === "Uncommon" && "text-[#01BD39]",
                    item.rarity === "Rare" && "text-[#01BFFF]",
                    item.rarity === "Very rare" && "text-[#D1017B]",
                    item.rarity === "Legendary" && "text-[#B7861D]",
                    item.rarity === "Story Item" && "text-[#FF5901]",
                    addLink && "hover:underline",
                )}
                href={addLink ? `https://bg3.wiki/${item.url}` : undefined}
                target={addLink ? "_blank" : undefined}
            >
                {item.name}
            </Wrapper>
        </div>
    );
}
