import {Button, ButtonGroup, Flex, HStack, Skeleton} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {LoginModal} from "./LoginModal";
import {HeaderTabs} from "./HeaderTabs";
import {Avatar} from "./Avatar";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";

export const Header = () => {
    const {pb, user, isAuth} = useAppContext();

    return (
        <Flex
            py={4}
            px={28}
            justify="space-between"
            align="items-end"
        >
            <ButtonGroup size={'md'}>
                {
                    isAuth ? null :
                        <LoginModal/>
                }
                <Button
                    rounded={'lg'}
                    colorPalette={'green'}
                >
                    Правила
                </Button>
            </ButtonGroup>
            <CollectionListAllProvider collection={pb.collection('users')}>
                <HeaderTabs/>
            </CollectionListAllProvider>
            {
                isAuth && user ?
                    <Avatar user={user}/>
                    : null
            }
        </Flex>
    )
}