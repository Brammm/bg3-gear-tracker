import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';

type Props = { items: Item[] };

type Item = {
    name: string;
    url: string;
    rarity: string;
    thumbnail: string;
}

export default function ItemCombobox({items}: Props) {
    const [ selectedItem, setSelectedItem ] = useState<Item | null>(null);
    const [ query, setQuery ] = useState('');

    const filteredItems =
        query === ''
            ? items
            : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox as="div" value={ selectedItem } onChange={ setSelectedItem } onClose={ () => setQuery('') }>
            <div className="relative mt-2">
                <ComboboxInput
                    aria-label="Item"
                    className="block w-full rounded-md bg-white py-1.5 pl-3 pr-12 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    displayValue={ (item: Item | null) => item?.name ?? '' }
                    onChange={ (event) => setQuery(event.target.value) }
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
                <ComboboxOptions anchor="bottom"
                                 className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    { filteredItems.map((item) => (
                        <ComboboxOption key={ item.name }
                                        value={ item }
                                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none">
                            <div className="flex items-center">
                                <img src={ item.thumbnail } alt="" className="size-6 shrink-0" />
                                <span className="ml-3 truncate group-data-[selected]:font-semibold">{ item.name }</span>
                            </div>

                            <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                <CheckIcon className="size-5" aria-hidden="true" />
                            </span>
                        </ComboboxOption>
                    )) }
                </ComboboxOptions>
            </div>
        </Combobox>
    );
}
