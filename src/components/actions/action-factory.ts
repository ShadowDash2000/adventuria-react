import { Done } from './done/done';
import { ActionDispenser } from './action-base';
import { RollDice } from './roll-dice/roll-dice';
import { Unknown } from './unknown';
import { RollWheel } from '@components/actions/roll-wheel/roll-wheel';
import { Drop } from './drop/drop';
import { Reroll } from './reroll/reroll';
import { Move } from './move/move';
import { Teleport } from './teleport/teleport';
import { BuyItem } from '@components/actions/buy-item/buy-item';
import { RollItemOnCell } from '@components/actions/roll-item-on-cell/roll-item-on-cell';

type ActionFactoryItem = { order: number; dispenser: ActionDispenser };

export class ActionFactory {
    private static actions: Record<string, ActionFactoryItem> = {
        done: { order: 0, dispenser: new Done() },
        drop: { order: 0, dispenser: new Drop() },
        reroll: { order: 0, dispenser: new Reroll() },
        rollDice: { order: 0, dispenser: new RollDice() },
        rollWheel: { order: 0, dispenser: new RollWheel() },
        buyItem: { order: 5, dispenser: new BuyItem() },
        rollItemOnCell: { order: 0, dispenser: new RollItemOnCell() },
        move: { order: 0, dispenser: new Move() },
        teleport: { order: 0, dispenser: new Teleport() },
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
