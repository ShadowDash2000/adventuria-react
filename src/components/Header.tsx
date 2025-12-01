import {Flex} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {LoginModalButton} from "./LoginModalButton";
import {Button} from "@ui/button";
import {Link} from "react-router-dom";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";
import {PlayersFloatingList} from "./board/PlayersFloatingList";
import {Modal} from "@ui/modal";
import {Rules} from "./Rules";

export const Header = () => {
    const {pb} = useAppContext();
    const {isAuth, logout} = useAppContext();

    return (
        <>
            <Flex
                py={4}
                justify="center"
                gap={5}
                wrap="wrap"
            >
                <Button asChild>
                    <Link to="/">
                        Главная
                    </Link>
                </Button>
                {isAuth ? null : <LoginModalButton/>}
                <Modal
                    lazyMount
                    unmountOnExit
                    title="Правила"
                    trigger={
                        <Button rounded={'lg'} colorPalette={'green'}>Правила</Button>
                    }
                >
                    <Rules/>
                </Modal>
                {isAuth
                    ? <Button colorPalette="red" onClick={() => logout()}>Выйти</Button>
                    : null
                }
            </Flex>
            <CollectionListAllProvider
                collection={pb.collection('users')}
                fields={"id,collectionName,name,avatar,color"}
            >
                <PlayersFloatingList/>
            </CollectionListAllProvider>
        </>
    )
}