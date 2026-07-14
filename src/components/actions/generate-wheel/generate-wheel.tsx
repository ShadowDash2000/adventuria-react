import { Status } from '@chakra-ui/react';
import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { Button } from './Button';

export class GenerateWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <Button key={this.key()} />;
    }

    color() {
        return 'purple';
    }

    name() {
        return '';
    }

    key() {
        return 'generate_wheel';
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
