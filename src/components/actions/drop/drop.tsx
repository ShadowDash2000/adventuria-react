import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Drop extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    key() {
        return 'drop';
    }
}
