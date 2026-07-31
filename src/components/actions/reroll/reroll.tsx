import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Reroll extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    key() {
        return 'reroll';
    }
}
