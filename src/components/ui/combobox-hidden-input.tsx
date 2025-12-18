import { type ComponentProps } from 'react';
import { useComboboxContext } from '@chakra-ui/react';

export const ComboboxHiddenInput = (props: ComponentProps<'input'>) => {
    const combobox = useComboboxContext();
    return <input type="hidden" value={combobox.value[0]} readOnly {...props} />;
};
