import {ButtonGroup, Flex} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {LoginModalButton} from "./LoginModalButton";
import {HeaderTabs} from "./HeaderTabs";
import {Avatar} from "./Avatar";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";
import {RulesModalButton} from "./RulesModalButton";

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
                {isAuth ? null : <LoginModalButton/>}
                <RulesModalButton/>
            </ButtonGroup>
            <CollectionListAllProvider collection={pb.collection('users')}>
                <HeaderTabs/>
            </CollectionListAllProvider>
            {isAuth && user ? <Avatar user={user}/> : null}
        </Flex>
    )
}