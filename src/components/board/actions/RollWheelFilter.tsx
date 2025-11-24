import {type FC, useState} from "react";
import {createListCollection, Field, HStack, Slider, VStack} from "@chakra-ui/react";
import {Combobox} from "@ui/combobox";
import {useQuery} from "@tanstack/react-query";
import type {GenreRecord} from "@shared/types/genre";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

export const RollWheelFilter: FC = () => {
    const {pb} = useAppContext();
    const [genresValue, setGenresValue] = useState<string>('');

    const {data: genres = []} = useQuery({
        queryFn: async () => {
            return pb.collection('genres').getFullList<GenreRecord>({
                filter: `name ~ "${genresValue}"`,
            });
        },
        refetchOnWindowFocus: false,
        queryKey: [genresValue],
    });

    const genresCollection = createListCollection({
        items: genres.map(genre => ({
            label: genre.name,
            value: genre.id,
        })),
    })

    return (
        <VStack w="20vw">
            <Slider.Root w="100%" defaultValue={[0, 500]} minStepsBetweenThumbs={1}>
                <HStack justify="space-between">
                    <Slider.Label>Стоимость</Slider.Label>
                    <Slider.ValueText/>
                </HStack>
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Range/>
                    </Slider.Track>
                    <Slider.Thumbs/>
                </Slider.Control>
            </Slider.Root>
            <Field.Root>
                <Combobox
                    collection={genresCollection}
                    label="Жанры"
                    inputValue={genresValue}
                    onInputValueChange={(e) => setGenresValue(e.inputValue)}
                    multiple
                />
            </Field.Root>
        </VStack>
    )
}