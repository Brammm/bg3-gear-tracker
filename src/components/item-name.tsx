import clsx from "clsx";
import type { Item } from "../App.tsx";

type Props = {
    addLink?: boolean;
    item: Item;
};

export default function ItemName({ item, addLink = false }: Props) {
    const Wrapper = addLink ? "a" : "span";

    return (
        <Wrapper
            className={clsx(
                "flex",
                addLink && "hover:underline",
                item.rarity === "Common" && "text-[#FFFFFF]",
                item.rarity === "Uncommon" && "text-[#01BD39]",
                item.rarity === "Rare" && "text-[#01BFFF]",
                item.rarity === "Very rare" && "text-[#D1017B]",
                item.rarity === "Legendary" && "text-[#B7861D]",
                item.rarity === "Story Item" && "text-[#FF5901]",
            )}
            href={addLink ? `https://bg3.wiki/${item.url}` : undefined}
            target={addLink ? "_blank" : undefined}
        >
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <span className="ml-3">{item.name}</span>
        </Wrapper>
    );
}
