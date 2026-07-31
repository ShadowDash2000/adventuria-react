import type { ReactNode } from 'react';
import { ActionDispenser } from './action-base';

export class Unknown extends ActionDispenser {
    buttonNode(): ReactNode {
        return 'Ой, ошибочка...';
    }

    key() {
        return 'unknown';
    }
}
