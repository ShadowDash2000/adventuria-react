import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from './Modal';

export class CompleteActivity extends ActionDispenser {
    buttonNode(): ReactNode {
        return <Modal key={this.key()} />;
    }

    key() {
        return 'complete_activity';
    }
}
