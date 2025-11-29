import {Done} from "./done/done";
import {ActionDispenser} from "./action-base";
import {RollDice} from "./roll-dice/roll-dice";
import {Unknown} from "./unknown";
import {RollWheel} from "./roll-wheel/roll-wheel";

export class ActionFactory {
    private static actions: Record<string, ActionDispenser> = {
        'done': new Done(),
        'rollDice': new RollDice(),
        'rollWheel': new RollWheel(),
    }

    static get(actionType: string): ActionDispenser {
        return this.actions[actionType] || new Unknown();
    }

    static getFirstAvailableAction(actionsTypes: string[]): ActionDispenser | null {
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