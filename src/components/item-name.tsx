import clsx from "clsx";
import { type Item, rarityColorMap } from "../data/rarity.ts";

type Props = {
    addLink?: boolean;
    item: Item;
};

export default function ItemName({ item, addLink = false }: Props) {
    const Wrapper = addLink ? "a" : "span";

    // @ts-expect-error Temp hack to let tailwind v4 recognize these
    const safelist = [
        "text-[#FFFFFF]",
        "text-[#01BD39]",
        "text-[#01BFFF]",
        "text-[#D1017B]",
        "text-[#B7861D]",
        "text-[#FF5901]",
    ];
    
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
