import {Done} from "@shared/types/actions/done";
import {ActionController} from "@shared/types/actions/action-base";
import {ReactNode} from "react";
import {RollDice} from "@shared/types/actions/roll-dice";

export class ActionFactory {
    private static actions: Record<string, ActionController> = {
        'done': new Done(),
        'rollDice': new RollDice(),
    }

    static get(actionType: string): ActionController {
        return this.actions[actionType]
    }

    static getFirstAvailableActionButton(actionsTypes: string[]): ReactNode | null {
        for (let actionType of actionsTypes) {
            const action = this.actions[actionType];
            if (!action) {
                continue;
            }

            const buttonNode = action.buttonNode();
            if (buttonNode) {
                return buttonNode;
            }
        }

        return null;
    }
}