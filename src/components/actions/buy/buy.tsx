import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/buy/Modal';

export class Buy extends ActionDispenser {
    buttonNode(): ReactNode {
        return <Modal key={this.key()} />;
    }

    color() {
        return 'purple';
    }

    name() {
        return 'Магаз';
    }

    key() {
        return 'shop';
    }

    statusNode() {
        return (
            <Status.Root colorPalette={this.color()}>
                <Status.Indicator />
                {this.name()}
            </Status.Root>
        );
    }
}
