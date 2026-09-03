import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/coins-for-item/Modal';

export class CoinsForItem extends ActionDispenser {
    buttonNode(): ReactNode {
        return <Modal key={this.key()} />;
    }

    key() {
        return 'coins-for-item';
    }
}
