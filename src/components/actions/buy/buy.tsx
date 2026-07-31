import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/buy/Modal';

export class Buy extends ActionDispenser {
    buttonNode(): ReactNode {
        return <Modal key={this.key()} />;
    }

    key() {
        return 'shop';
    }
}
