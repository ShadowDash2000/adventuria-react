import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Done extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    key() {
        return 'done';
    }
}
