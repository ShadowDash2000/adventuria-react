import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { ItemOnCellWheelButton } from './ItemOnCellWheelButton';

export class RollItemOnCell extends ActionDispenser {
    buttonNode(): ReactElement {
        return <ItemOnCellWheelButton key={this.key()} />;
    }

    key() {
        return 'roll_item_on_cell';
    }
}
