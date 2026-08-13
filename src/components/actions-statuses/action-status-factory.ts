import type { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';
import { Unknown } from '@components/actions-statuses/unknown';
import { Start } from '@components/actions-statuses/start/start';
import { Move } from '@components/actions-statuses/move/move';
import { Done } from '@components/actions-statuses/done/done';
import { Drop } from '@components/actions-statuses/drop/drop';
import { Reroll } from '@components/actions-statuses/reroll/reroll';
import { NeedToRollWheel } from '@components/actions-statuses/need-to-roll-wheel/need_to_roll_wheel';
import { RollDice } from '@components/actions-statuses/roll-dice/roll-dice';
import { RollItemOnCell } from '@components/actions-statuses/roll-item-on-cell/roll-item-on-cell';
import { RollWheel } from '@components/actions-statuses/roll-wheel/roll-wheel';
import { Teleport } from '@components/actions-statuses/teleport/teleport';

export class ActionStatusFactory {
    private static actions: Record<string, ActionStatusDispenser> = {
        start: new Start(),
        move: new Move(),
        done: new Done(),
        drop: new Drop(),
        reroll: new Reroll(),
        need_to_roll_wheel: new NeedToRollWheel(),
        roll_dice: new RollDice(),
        roll_item_on_cell: new RollItemOnCell(),
        roll_wheel: new RollWheel(),
        teleport: new Teleport(),
    };

    static get(actionType: string): ActionStatusDispenser {
        return this.actions[actionType] || new Unknown();
    }
}
