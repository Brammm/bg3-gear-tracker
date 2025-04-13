import { Square, SquareCheckBig } from "lucide-react";

type Props = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
};

export default function Checkbox({
    checked = false,
    onChange = () => {},
}: Props) {
    const handleClick = () => {
        onChange(!checked);
    };

    return (
        <button type="button" onClick={handleClick}>
            {checked ? (
                <SquareCheckBig className="size-5 text-emerald-500" />
            ) : (
                <Square className="size-5 text-text" />
            )}
        </button>
    );
}
