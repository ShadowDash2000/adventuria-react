import {Done} from "@shared/types/actions/done";
import {ActionController} from "@shared/types/actions/action-base";
import {RollDice} from "@shared/types/actions/roll-dice";
import {Unknown} from "@shared/types/actions/unknown";
import {RollWheel} from "@shared/types/actions/roll-wheel";

export class ActionFactory {
    private static actions: Record<string, ActionController> = {
        'done': new Done(),
        'rollDice': new RollDice(),
        'rollWheel': new RollWheel(),
    }

    static get(actionType: string): ActionController {
        return this.actions[actionType] || new Unknown();
    }

    static getFirstAvailableAction(actionsTypes: string[]): ActionController | null {
        for (let actionType of actionsTypes) {
            const action = this.actions[actionType];
            if (!action) {
                continue;
            }

            return action;
        }

        return new Unknown();
    }
}