import {Status} from "@chakra-ui/react";
import {type ReactElement} from "react";
import {ActionDispenser} from "../action-base";
import {RollDiceButton} from "./RollDiceButton";

export class RollDice extends ActionDispenser {
    buttonNode(): ReactElement {
        return <RollDiceButton/>
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