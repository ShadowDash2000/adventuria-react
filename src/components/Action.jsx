import {Button, Card, HStack} from "@chakra-ui/react";
import {LuLoader, LuPencil} from "react-icons/lu";
import {UserAvatar} from "./Avatar.jsx";
import {useUserById} from "../pocketbase/users.js";
import HTMLReactParser from "html-react-parser";
import {Suspense} from "react";

export const Action = ({action}) => {
    const {user} = useUserById(action?.user);

    return (
        <Card.Root>
            <Card.Body>
                <HStack mb="6" gap="3">
                    <Suspense fallback={<LuLoader/>}>
                        <UserAvatar user={user}/>
                    </Suspense>
                </HStack>
                <Card.Description>
                    {HTMLReactParser(action?.comment)}
                </Card.Description>
            </Card.Body>
            <Card.Footer>
                <Button variant="subtle">
                    <LuPencil/>
                    Изменить
                </Button>
            </Card.Footer>
        </Card.Root>
    )
}