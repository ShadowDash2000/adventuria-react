import { useSettingsStore } from '@components/settings/useSettingsStore';
import {
    Checkbox,
    createListCollection,
    Portal,
    Select,
    StackProps,
    VStack,
} from '@chakra-ui/react';
import { Theme } from './useSettingsStore';
import { Appearance } from '@/theme/theme';

const appearanceCollection = createListCollection<{ label: string; value: Appearance }>({
    items: [
        { label: 'Приключпопия 3', value: 'adventuria-3' },
        { label: 'Приключпопия 4', value: 'adventuria-4' },
    ],
});

const themesCollection = createListCollection<{ label: string; value: Theme }>({
    items: [
        { label: 'Без фона', value: 'disabled' },
        { label: 'Белый', value: 'white' },
        { label: 'Синий', value: 'blue' },
    ],
});

export const SettingsContent = ({ ...props }: StackProps) => {
    const {
        appearance,
        setAppearance,
        theme,
        setTheme,
        displayCellsNumber,
        setDisplayCellsNumber,
    } = useSettingsStore();

    return (
        <VStack {...props}>
            <Select.Root
                collection={appearanceCollection}
                defaultValue={[appearance]}
                onValueChange={e => {
                    if (!e.items.length) return;
                    setAppearance(e.items[0].value);
                }}
            >
                <Select.HiddenSelect />
                <Select.Label>Тема</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {appearanceCollection.items.map(appearance => (
                                <Select.Item item={appearance} key={appearance.value}>
                                    {appearance.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Select.Root
                collection={themesCollection}
                defaultValue={[theme]}
                onValueChange={e => {
                    if (!e.items.length) return;
                    setTheme(e.items[0].value);
                }}
            >
                <Select.HiddenSelect />
                <Select.Label>Фон</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {themesCollection.items.map(theme => (
                                <Select.Item item={theme} key={theme.value}>
                                    {theme.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            <Checkbox.Root
                defaultChecked={displayCellsNumber}
                onCheckedChange={e => setDisplayCellsNumber(!!e.checked)}
            >
                <Checkbox.HiddenInput />
                <Checkbox.Label>Отображение нумерации клеток</Checkbox.Label>
                <Checkbox.Control />
            </Checkbox.Root>
        </VStack>
    );
};
