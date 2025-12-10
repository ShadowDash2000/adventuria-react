import { Portal, Select as ChakraSelect, type SelectRootProps } from '@chakra-ui/react';

export interface SelectProps extends SelectRootProps {
    label?: string;
    placeholder?: string;
}

export const Select = ({ label, placeholder, collection, ...props }: SelectProps) => {
    return (
        <ChakraSelect.Root collection={collection} {...props}>
            <ChakraSelect.HiddenSelect />
            <ChakraSelect.Label>{label}</ChakraSelect.Label>
            <ChakraSelect.Control>
                <ChakraSelect.Trigger>
                    <ChakraSelect.ValueText placeholder={placeholder} />
                </ChakraSelect.Trigger>
                <ChakraSelect.IndicatorGroup>
                    <ChakraSelect.Indicator />
                </ChakraSelect.IndicatorGroup>
            </ChakraSelect.Control>
            <Portal>
                <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                        {collection.items.map(item => (
                            <ChakraSelect.Item item={item} key={item.value}>
                                {item.label}
                                <ChakraSelect.ItemIndicator />
                            </ChakraSelect.Item>
                        ))}
                    </ChakraSelect.Content>
                </ChakraSelect.Positioner>
            </Portal>
        </ChakraSelect.Root>
    );
};
