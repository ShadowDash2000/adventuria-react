import {type FC, type Key, type ReactNode, useMemo} from "react";
import type {ItemRecord} from "@shared/types/item";
import {Card, Flex, Image} from "@chakra-ui/react";
import {Button} from "@ui/button";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Modal} from "@ui/modal";
import {EffectFactory} from "@shared/types/effects/effect-factory";
import {useForm} from "react-hook-form";

interface InventoryItemProps {
    item: ItemRecord
}

export const InventoryItem: FC<InventoryItemProps> = ({item}) => {
    const {pb} = useAppContext();
    const icon = useMemo(() => pb.files.getURL(item, item.icon), [item.icon]);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm();

    const effects = useMemo(() => {
        const e = [] as ReactNode[];
        for (const [i, effect] of item.expand?.effects.entries()!) {
            e.push(
                EffectFactory.get(effect.type).buildInputs(i, register)
            );
        }
        return e;
    }, []);
    const needModal = useMemo(() => {
        for (const effect of effects) {
            if (effect != null) return true;
        }
        return false;
    }, [effects]);

    const onSubmit = (values: any) => {
        console.log(values)
    }

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
                            <form onSubmit={handleSubmit(onSubmit)}>
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