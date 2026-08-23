import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/roll-wheel/items-on-cell-wheel/Modal';

export class RollItemOnCell extends ActionDispenser {
    buttonNode(): ReactElement {
        return <Modal key={this.key()} />;
    }

    key() {
        return 'roll_item_on_cell';
    }
}
