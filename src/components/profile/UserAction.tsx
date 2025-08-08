import {Button, Card, HStack} from "@chakra-ui/react";
import {LuPencil} from "react-icons/lu";
import HTMLReactParser from "html-react-parser";
import {FC} from "react";
import {Avatar} from "../Avatar";
import {ActionRecord} from "@shared/types/action";
import {useCollectionOneFilter} from "@context/CollectionOneFilterContext";
import {UserRecord} from "@shared/types/user";

type ActionProps = {
    action: ActionRecord;
}

export const UserAction: FC<ActionProps> = ({action}) => {
    const {data: user} = useCollectionOneFilter<UserRecord>();

    return (
        <Card.Root>
            <Card.Body>
                <HStack mb="6" gap="3">
                    <Avatar user={user}/>
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