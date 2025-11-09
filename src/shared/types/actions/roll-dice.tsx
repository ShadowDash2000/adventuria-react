import {Status} from "@chakra-ui/react";
import type {ReactNode} from "react";
import {ActionController} from "@shared/types/actions/action-base";
import {Button} from "@ui/button";

export class RollDice extends ActionController {
    buttonNode(): ReactNode {
        return (
            <Button>
                Бросить кубик
            </Button>
        )
    }

    color() {
        return 'purple'
    }

    name() {
        return 'Бросил кубики'
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