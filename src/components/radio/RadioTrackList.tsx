import { Listbox, useListCollection } from '@chakra-ui/react';
import type { AudioRecord } from '@shared/types/audio';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';

interface RadioTrackListProps {
    audioId?: RecordIdString;
    audio: AudioRecord[];
    onTrackChange?: (id: RecordIdString) => void;
}

export const RadioTrackList = ({ audioId, audio, onTrackChange }: RadioTrackListProps) => {
    const [value, setValue] = useState<string[]>([audioId || '']);
    const { collection, set: setCollection } = useListCollection<AudioRecord>({
        initialItems: [],
        itemToString: item => item.name,
        itemToValue: item => item.id,
    });
    const activeItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setCollection(audio || []);
    }, [audio]);

    useEffect(() => {
        if (audioId) setValue([audioId]);
    }, [audioId, setValue]);

    useLayoutEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [audioId, collection.items.length]);

    return (
        <Listbox.Root
            value={value}
            collection={collection}
            onValueChange={e => {
                setValue(e.value);
                onTrackChange?.(e.value[0]);
            }}
        >
            <Listbox.Content maxH="{sizes.32}">
                {collection.items.map(audio => (
                    <Listbox.Item
                        item={audio}
                        key={audio.id}
                        ref={audio.id === audioId ? activeItemRef : null}
                    >
                        <Listbox.ItemText>{audio.name}</Listbox.ItemText>
                        <Listbox.ItemIndicator />
                    </Listbox.Item>
                ))}
            </Listbox.Content>
        </Listbox.Root>
    );
};
