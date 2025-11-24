import {Combobox as ChakraCombobox, type ComboboxRootProps, type ListCollection, Portal, Span} from "@chakra-ui/react"
import {type FC} from "react"

interface ComboboxProps extends ComboboxRootProps {
    collection: ListCollection;
    label?: string;
    placeholder?: string;
}

export const Combobox: FC<ComboboxProps> = (
    {
        collection,
        label,
        placeholder,
        ...props
    }
) => {
    return (
        <ChakraCombobox.Root
            collection={collection}
            {...props}
        >
            <ChakraCombobox.Label>{label}</ChakraCombobox.Label>
            <ChakraCombobox.Control>
                <ChakraCombobox.Input placeholder={placeholder}/>
                <ChakraCombobox.IndicatorGroup>
                    <ChakraCombobox.ClearTrigger/>
                    <ChakraCombobox.Trigger/>
                </ChakraCombobox.IndicatorGroup>
            </ChakraCombobox.Control>
            <Portal>
                <ChakraCombobox.Positioner>
                    <ChakraCombobox.Content>
                        {collection.items?.map((item) => (
                            <ChakraCombobox.Item key={item.value} item={item}>
                                <Span truncate>
                                    {item.label}
                                </Span>
                                <ChakraCombobox.ItemIndicator/>
                            </ChakraCombobox.Item>
                        ))}
                    </ChakraCombobox.Content>
                </ChakraCombobox.Positioner>
            </Portal>
        </ChakraCombobox.Root>
    )
}