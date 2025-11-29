import {Status} from "@chakra-ui/react";
import {type ReactElement} from "react";
import {ActionDispenser} from "../action-base";
import {RollWheelModal} from "./RollWheelModal";

export class RollWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <RollWheelModal/>
    }

    color() {
        return 'purple'
    }

    name() {
        return 'Выролял'
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