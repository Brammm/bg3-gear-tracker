import clsx from 'clsx';

type Props = {
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
};

export default function NavButton({active = false, children, onClick = () => {}}: Props) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={clsx(
                    "flex items-center px-1 py-2 cursor-pointer border-b-2",
                    active
                        ? "text-primary border-primary"
                        : "border-transparent hover:border-neutral-400 hover:text-neutral-400",
                )}
        >
            {children}
        </button>
    );
}
