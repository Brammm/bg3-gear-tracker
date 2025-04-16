import clsx from "clsx";
import { rarityColorMap } from "../data/rarity.ts";
import type { Item } from "../data/type.ts";

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
                `text-[${rarityColorMap[item.rarity]}]`,
            )}
            href={addLink ? `https://bg3.wiki/${item.url}` : undefined}
            target={addLink ? "_blank" : undefined}
        >
            <img className="size-6" src={item.thumbnail} alt={item.name} />
            <span className="ml-3">{item.name}</span>
        </Wrapper>
    );
}
