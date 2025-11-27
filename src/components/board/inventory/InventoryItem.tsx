import {type FC, type ReactNode, useMemo} from "react";
import type {ItemRecord} from "@shared/types/item";
import {Card, Flex, Image} from "@chakra-ui/react";
import {Button} from "@ui/button";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Modal} from "@ui/modal";
import {EffectFactory} from "@shared/types/effects/effect-factory";

interface InventoryItemProps {
    item: ItemRecord
}

export const InventoryItem: FC<InventoryItemProps> = ({item}) => {
    const {pb} = useAppContext();
    const icon = useMemo(() => pb.files.getURL(item, item.icon), [item.icon]);

    const handleSubmit = (formData: FormData) => {
        console.log(Object.fromEntries(formData));
    }

    const effects = useMemo(() => (
        item.expand?.effects.entries()!.reduce((prev, [i, effect]) => (
            [...prev, EffectFactory.get(effect.type).buildInputs(i)]
        ), [] as ReactNode[]) || []
    ), []);

    const needModal = useMemo(() => (
        effects.some((value) => value !== null)
    ), [effects]);

    return (
        <Card.Root>
            <Card.Body gap="2">
                <Image
                    src={icon}
                    width="100%"
                    height="100%"
                />
                <Card.Title mt="2">{item.name}</Card.Title>
                <Card.Description
                    dangerouslySetInnerHTML={{__html: item.description}}
                    minH={5}
                />
            </Card.Body>
            <Card.Footer flexDirection="column">
                <Button colorPalette="red">Выбросить</Button>
                {
                    needModal ?
                        <Modal
                            title=""
                            trigger={
                                <Button colorPalette="green">Использовать</Button>
                            }
                        >
                            <form action={handleSubmit}>
                                {effects}
                                <Flex justifyContent="center" pt={5}>
                                    <Button
                                        type="submit"
                                        colorPalette="green"
                                    >Сохранить</Button>
                                </Flex>
                            </form>
                        </Modal>
                        : <Button colorPalette="green">Использовать</Button>
                }
            </Card.Footer>
        </Card.Root>
    );
}