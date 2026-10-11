import { createSystem, defaultConfig } from '@chakra-ui/react';
import { baseConfig } from './base/theme';
import { adventuria3Config } from './adventuria-3/theme';
import { adventuria4Config } from './adventuria-4/theme';

export { colorModeConfig } from './base/theme';

export const systems = {
    'adventuria-3': createSystem(defaultConfig, baseConfig, adventuria3Config),
    'adventuria-4': createSystem(defaultConfig, baseConfig, adventuria4Config),
};

export type Appearance = keyof typeof systems;
