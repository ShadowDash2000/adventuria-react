import {Status} from "@chakra-ui/react";
import {type ReactElement} from "react";
import {ActionController} from "@shared/types/actions/action-base";
import {RollWheelModal} from "../../../components/board/actions/RollWheelModal";

export class RollWheel extends ActionController {
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