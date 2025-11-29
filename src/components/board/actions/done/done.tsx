import {Status} from "@chakra-ui/react";
import type {ReactNode} from "react";
import {ActionDispenser} from "../action-base";

export class Done extends ActionDispenser {
    buttonNode(): ReactNode {
        return undefined;
    }

    color() {
        return 'green'
    }

    name() {
        return 'Завершено'
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