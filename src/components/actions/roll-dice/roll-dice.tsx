import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { RollDiceButton } from './RollDiceButton';

export class RollDice extends ActionDispenser {
    buttonNode(): ReactElement {
        return <RollDiceButton key={this.key()} />;
    }

    key() {
        return 'roll_dice';
    }
}
