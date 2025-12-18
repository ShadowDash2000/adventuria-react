import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { BuyItemModal } from '@components/actions/buy-item/BuyItemModal';

export class BuyItem extends ActionDispenser {
    buttonNode(): ReactNode {
        return <BuyItemModal key={this.key()} />;
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
