import { Button as UIButton } from "@headlessui/react";
import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
    small?: boolean;
    title?: string;
    active?: boolean;
};

export default function Button({
    children,
    disabled = false,
    onClick,
    small = false,
    title,
    active = false,
}: Props) {
    return (
        <UIButton
            disabled={disabled}
            type="button"
            onClick={onClick}
            className={clsx(
                "flex items-center rounded-md text-sm font-semibold shadow-sm data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-primary cursor-pointer data-[disabled]:cursor-not-allowed",
                active
                    ? "bg-primary text-gray-light"
                    : "bg-gray-dark text-text data-[hover]:bg-primary data-[hover]:text-gray-light",
                small ? "p-1" : "px-3 py-2",
            )}
            title={title}
        >
            {children}
        </UIButton>
    );
}
