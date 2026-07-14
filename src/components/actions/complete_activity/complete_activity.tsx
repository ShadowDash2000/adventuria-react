import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from './Modal';

export class CompleteActivity extends ActionDispenser {
    buttonNode(): ReactNode {
        return <Modal key={this.key()} />;
    }

    color() {
        return '';
    }

    name() {
        return '';
    }

    key() {
        return 'complete_activity';
    }

    statusNode() {
        return null;
    }
}
