import equipment from '../data/equipment.json';
import ItemCombobox from './item-combobox.tsx';

type Props = {
    selectedItems: {
        type: string;
        item: string[];
    }[];
};

export default function GearSelector({selectedItems}: Props) {
    return (
        <div>
            { equipment.map((type) => (
                <div key={ type.name }>
                    <h2 className="flex items-center">
                        <img src={ type.thumbnail } alt={ type.name } className="size-6 shrink-0" />
                        <span className="ml-3">{ type.name }</span>
                    </h2>
                    <ItemCombobox items={ type.items } />
                </div>
            )) }
        </div>
    );
}
