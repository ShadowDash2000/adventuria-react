import {Button, Card, HStack} from "@chakra-ui/react";
import {LuLoader, LuPencil} from "react-icons/lu";
import HTMLReactParser from "html-react-parser";
import {FC} from "react";
import {Avatar} from "./Avatar";
import {ActionRecord} from "@shared/types/action";

type ActionProps = {
    action: ActionRecord;
}

export const Action: FC<ActionProps> = ({action}) => {
    // TODO somehow pass the user here
    // implement new collection context, that accepts filtering and returns one record
    return (
        <Card.Root>
            <Card.Body>
                <HStack mb="6" gap="3">
                    {/*<Avatar user={user}/>*/}
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