import {CloseButton, Dialog, Portal, Text} from "@chakra-ui/react"
import {Button} from "@ui/button";
import {WheelOFortune} from "./WheelOFortune";
import {useQuery} from "@tanstack/react-query";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {LuLoader} from "react-icons/lu";
import type {ActionRecord} from "@shared/types/action";
import type {GameRecord} from "@shared/types/game";

export const WheelOFortuneModal = () => {
    const {pb, user} = useAppContext();
    const action = useQuery({
        queryFn: () => pb.collection('actions').getFirstListItem<ActionRecord>(
            `user = "${user!.id}"`,
            {
                sort: '-created',
                fields: 'items_list',
            },
        ),
        refetchOnWindowFocus: false,
        queryKey: ['action'],
    });
    const games = useQuery({
        queryFn: () => pb.collection('games').getFullList<GameRecord>({
            filter: action.data!.items_list.map((id) => `id="${id}"`).join('||'),
            fields: 'id,cover,name',
        }),
        refetchOnWindowFocus: false,
        enabled: action.isSuccess,
        queryKey: [action],
    });

    if (action.isPending || games.isPending) return <LuLoader/>;
    if (action.isError) return <Text>Error: {action.error?.message}</Text>;
    if (games.isError) return <Text>Error: {games.error?.message}</Text>;

    const wheelItems = games.data.map((game) => ({
        key: game.id,
        image: game.cover,
        title: game.name,
    }));

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            size="full"
        >
            <Dialog.Trigger asChild>
                <Button>Колесо</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)"/>
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0} display="flex">
                        <Dialog.Body>
                            <WheelOFortune
                                items={wheelItems}
                            />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm"/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}