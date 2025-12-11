import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContextProvider';
import type { TagRecord } from '@shared/types/tag';
import { createListCollection } from '@chakra-ui/react';
import { Select, type SelectProps } from '@ui/select';

type GameTagSelectProps = Omit<SelectProps, 'collection'>;

export const GameTagSelect = (props: GameTagSelectProps) => {
    const { pb } = useAppContext();
    const { data: tags = [] } = useQuery({
        queryFn: () => pb.collection('tags').getFullList<TagRecord>(),
        placeholderData: keepPreviousData,
        queryKey: ['tags'],
    });

    const tagsCollection = createListCollection({
        items: tags.map(tag => ({ label: tag.name, value: tag.id })),
    });

    return <Select {...props} collection={tagsCollection} />;
};
