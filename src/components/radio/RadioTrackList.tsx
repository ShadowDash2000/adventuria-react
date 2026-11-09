import { Listbox, useListCollection } from '@chakra-ui/react';
import { type Track, useRadioStore } from '@components/radio/useRadioStore';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRadio } from '@components/radio/useRadio';

export const RadioTrackList = () => {
    const { currentTrack, playById } = useRadio();
    const trackList = useRadioStore(state => state.trackList);

    const [value, setValue] = useState<string[]>([currentTrack?.id || '']);
    const { collection, set: setCollection } = useListCollection<Track>({
        initialItems: [],
        itemToString: item => item.title,
        itemToValue: item => item.id,
    });
    const activeItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setCollection(Array.from(trackList.values()));
    }, [trackList]);

    useEffect(() => {
        if (currentTrack) setValue([currentTrack.id]);
    }, [currentTrack, setValue]);

    useLayoutEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [currentTrack, collection.items.length]);

    return (
        <Listbox.Root
            value={value}
            collection={collection}
            onValueChange={({ value }) => {
                setValue(value);
                void playById(value[0]);
            }}
        >
            <Listbox.Content maxH={32} minW={60} bg="none" border="none">
                {collection.items.map(audio => (
                    <Listbox.Item
                        item={audio}
                        key={audio.id}
                        ref={audio.id === currentTrack?.id ? activeItemRef : null}
                    >
                        <Listbox.ItemText>{audio.title}</Listbox.ItemText>
                        <Listbox.ItemIndicator />
                    </Listbox.Item>
                ))}
            </Listbox.Content>
        </Listbox.Root>
    );
};
