import { useState } from 'react';
import {
    Box,
    createListCollection,
    Grid,
    Heading,
    HStack,
    IconButton,
    Portal,
    SegmentGroup,
    Select,
    Text,
} from '@chakra-ui/react';
import { TbRefresh } from 'react-icons/tb';
import { actionSchema, cellSchema } from '@shared/pbSchema';
import { dotExpand } from '@shared/pbExpand';
import { useActionsListContext } from './ActionsListContext';

const buildFilter = (actionStatus: string, cellType: string) =>
    [
        actionStatus === 'all' ? '' : `${actionSchema.status} = "${actionStatus}"`,
        cellType === 'all'
            ? ''
            : `${dotExpand(actionSchema.cell, cellSchema.type)} = "${cellType}"`,
    ]
        .filter(Boolean)
        .join(' && ');

export const ActionsFilter = () => {
    const { setFilter, totalItems, isFetching, refetch } = useActionsListContext();
    const [actionStatus, setActionStatus] = useState('all');
    const [cellType, setCellType] = useState('all');

    return (
        <>
            <HStack>
                <Heading size="2xl">Последние ходы</Heading>
                <IconButton
                    size="xs"
                    bg="none"
                    color="white"
                    disabled={isFetching}
                    _hover={{ cursor: 'pointer' }}
                    onClick={refetch}
                >
                    <Box
                        w="full"
                        h="full"
                        data-loading={isFetching}
                        css={{
                            '&[data-loading="true"]': {
                                animation: 'spin 1s linear infinite reverse',
                            },
                        }}
                    >
                        <TbRefresh style={{ width: '100%', height: '100%' }} />
                    </Box>
                </IconButton>
            </HStack>
            <Grid
                templateColumns={{ base: '1fr', md: '1fr auto 1fr' }}
                alignItems="center"
                justifyItems="center"
                gap={8}
                w="full"
            >
                <Text justifySelf={{ base: 'center', md: 'end' }}>Всего: {totalItems}</Text>
                <SegmentGroup.Root
                    value={actionStatus}
                    onValueChange={event => {
                        if (!event.value) return;
                        setActionStatus(event.value);
                        setFilter(buildFilter(event.value, cellType));
                    }}
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={[
                            { label: 'Все', value: 'all' },
                            { label: 'Завершено', value: 'done' },
                            { label: 'Дроп', value: 'drop' },
                            { label: 'Реролл', value: 'reroll' },
                            { label: 'Колесо', value: 'roll_wheel' },
                        ]}
                    />
                </SegmentGroup.Root>
                <Select.Root
                    size="sm"
                    w={200}
                    justifySelf={{ base: 'center', md: 'start' }}
                    collection={cellTypes}
                    value={[cellType]}
                    onValueChange={event => {
                        const value = event.value[0];
                        setCellType(value);
                        setFilter(buildFilter(actionStatus, value));
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Тип действия" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {cellTypes.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Grid>
        </>
    );
};

const cellTypes = createListCollection({
    items: [
        { label: 'Все', value: 'all' },
        { label: 'Игры', value: 'game' },
        { label: 'Фильмы', value: 'movie' },
        { label: 'Тюрьма', value: 'jail' },
        { label: 'Качалки', value: 'gym' },
        { label: 'Буфет', value: 'shop' },
        { label: 'Казик', value: 'casino' },
        { label: 'Лестницы/Ямы', value: 'teleport' },
        { label: 'Бафы/Дебафы', value: 'rollItem' },
    ],
});
