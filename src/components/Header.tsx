import {ButtonGroup, Flex} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {LoginModalButton} from "./LoginModalButton";
import {HeaderTabs} from "./HeaderTabs";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";
import {RulesModalButton} from "./RulesModalButton";
import {Button} from "@ui/button";

export const Header = () => {
    const {pb, isAuth, logout} = useAppContext();

    return (
        <Flex
            py={4}
            px={28}
            justify="center"
            gap={5}
        >
            <CollectionListAllProvider collection={pb.collection('users')}>
                <HeaderTabs/>
            </CollectionListAllProvider>
            <ButtonGroup size={'md'}>
                {isAuth ? null : <LoginModalButton/>}
                <RulesModalButton/>
                {isAuth
                    ? <Button colorPalette="red" onClick={() => logout()}>Выйти</Button>
                    : null
                }
            </ButtonGroup>
        </Flex>
    )
}