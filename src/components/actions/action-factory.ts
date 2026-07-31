import { CompleteActivity } from '@components/actions/complete_activity/complete_activity';
import { ActionDispenser } from './action-base';
import { RollDice } from './roll-dice/roll-dice';
import { Unknown } from './unknown';
import { RollWheel } from '@components/actions/roll-wheel/roll-wheel';
import { Drop } from './drop/drop';
import { Reroll } from './reroll/reroll';
import { Teleport } from './teleport/teleport';
import { Buy } from '@components/actions/buy/buy';
import { RollItemOnCell } from '@components/actions/roll-item-on-cell/roll-item-on-cell';
import { GenerateWheel } from '@components/actions/generate-wheel/generate-wheel';
import { NeedToRollWheel } from '@components/actions/need-to-roll-wheel/need_to_roll_wheel';
import { Done } from '@components/actions/done/done';

type ActionFactoryItem = { order: number; dispenser: ActionDispenser };

export class ActionFactory {
    private static actions: Record<string, ActionFactoryItem> = {
        complete_activity: { order: 0, dispenser: new CompleteActivity() },
        done: { order: 0, dispenser: new Done() },
        drop: { order: 0, dispenser: new Drop() },
        reroll: { order: 0, dispenser: new Reroll() },
        roll_dice: { order: 0, dispenser: new RollDice() },
        generate_wheel: { order: 0, dispenser: new GenerateWheel() },
        need_to_roll_wheel: { order: 0, dispenser: new NeedToRollWheel() },
        roll_wheel: { order: 0, dispenser: new RollWheel() },
        buy: { order: 5, dispenser: new Buy() },
        roll_item_on_cell: { order: 0, dispenser: new RollItemOnCell() },
    };

    static get(actionType: string): ActionDispenser {
        return this.actions[actionType]?.dispenser || new Unknown();
    }

    static getAvailableActions(actionsTypes: string[]): ActionDispenser[] {
        const foundActions: ActionFactoryItem[] = [];

        for (const actionType of actionsTypes) {
            const action = this.actions[actionType];
            if (action) {
                foundActions.push(action);
            }
        }

        if (foundActions.length === 0) {
            return [new Unknown()];
        }

        return foundActions.sort((a, b) => a.order - b.order).map(item => item.dispenser);
    }
}
