import { Done } from './done/done';
import { ActionDispenser } from './action-base';
import { RollDice } from './roll-dice/roll-dice';
import { Unknown } from './unknown';
import { RollWheel } from '@components/actions/roll-wheel/roll-wheel';
import { Drop } from './drop/drop';
import { Reroll } from './reroll/reroll';

export class ActionFactory {
    private static actions: Record<string, ActionDispenser> = {
        done: new Done(),
        drop: new Drop(),
        reroll: new Reroll(),
        rollDice: new RollDice(),
        rollWheel: new RollWheel(),
    };

    static get(actionType: string): ActionDispenser {
        return this.actions[actionType] || new Unknown();
    }

    static getAvailableActions(actionsTypes: string[]): ActionDispenser[] {
        const actions: ActionDispenser[] = [];
        for (const actionType of actionsTypes) {
            const action = this.actions[actionType];
            if (!action) {
                continue;
            }

            actions.push(action);
        }

        return actions || [new Unknown()];
    }
}
