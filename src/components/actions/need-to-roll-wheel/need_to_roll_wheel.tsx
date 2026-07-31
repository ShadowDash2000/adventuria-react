import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class NeedToRollWheel extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    key() {
        return 'need_to_roll_wheel';
    }
}
