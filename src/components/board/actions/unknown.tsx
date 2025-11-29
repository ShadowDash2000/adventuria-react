import {Status} from "@chakra-ui/react";
import type {ReactNode} from "react";
import {ActionDispenser} from "./action-base";

export class Unknown extends ActionDispenser {
    buttonNode(): ReactNode {
        return 'Ой, ошибочка...';
    }

    color() {
        return 'red'
    }

    name() {
        return '[ДАННЫЕ УДАЛЕНЫ]'
    }

    statusNode() {
        return (
            <Status.Root colorPalette={this.color()}>
                <Status.Indicator/>
                {this.name()}
            </Status.Root>
        )
    }
}