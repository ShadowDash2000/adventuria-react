import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/roll-wheel/activities-wheel/Modal';

export class RollWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <Modal key={this.key()} />;
    }

    key() {
        return 'roll_wheel';
    }
}
