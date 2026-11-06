import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { DialogButton } from './DialogButton';

export class RollWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <DialogButton key={this.key()} />;
    }

    key() {
        return 'roll_wheel';
    }
}
