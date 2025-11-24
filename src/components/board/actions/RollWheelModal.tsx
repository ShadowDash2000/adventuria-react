import {type FC, useState} from "react";
import {
    CloseButton,
    Dialog,
    Portal,
    Tabs,
    useTabs,
} from "@chakra-ui/react";
import {Button} from "@ui/button";
import {LuFerrisWheel, LuFilter} from "react-icons/lu";
import {RollWheelFilter} from "./RollWheelFilter";

export const RollWheelModal: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const tabs = useTabs({
        defaultValue: 'wheel',
    });

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size="full"
        >
            <Dialog.Trigger asChild>
                <Button>Колесо</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content
                        bg="none"
                        boxShadow="none"
                        mt={0}
                        display="flex"
                    >
                        <Tabs.RootProvider
                            value={tabs}
                            variant="plain"
                            lazyMount
                        >
                            <Dialog.Header justifyContent="center">
                                <Tabs.List bg={'bg.muted'} rounded={'lg'}>
                                    <Tabs.Trigger value="wheel">
                                        <LuFerrisWheel/>
                                        Колесо
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="filter">
                                        <LuFilter/>
                                        Фильтр
                                    </Tabs.Trigger>
                                    <Tabs.Indicator rounded={'lg'} bg={'purple.400'}/>
                                </Tabs.List>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Tabs.Content value="wheel">

                                </Tabs.Content>
                                <Tabs.Content
                                    value="filter"
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <RollWheelFilter/>
                                </Tabs.Content>
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm"/>
                            </Dialog.CloseTrigger>
                        </Tabs.RootProvider>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}