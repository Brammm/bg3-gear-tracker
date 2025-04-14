import { Button as UIButton } from "@headlessui/react";
import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
    small?: boolean;
    title?: string;
};

export default function Button({
    children,
    disabled = false,
    onClick,
    small = false,
    title,
}: Props) {
    return (
        <UIButton
            disabled={disabled}
            type="button"
            onClick={onClick}
            className={clsx(
                "flex items-center rounded-md bg-gray-dark text-sm font-semibold text-text shadow-sm  data-[hover]:bg-primary data-[hover]:text-gray-light data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-primary cursor-pointer data-[disabled]:cursor-not-allowed",
                small ? "p-1" : "px-3 py-2",
            )}
            title={title}
        >
            {children}
        </UIButton>
    );
}
