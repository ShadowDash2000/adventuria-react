import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { systems } from './theme';
import { useSettingsStore } from '@components/settings/useSettingsStore';

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
    const appearance = useSettingsStore(state => state.appearance);

    return (
        <ChakraProvider value={systems[appearance] ?? systems['adventuria-4']}>
            {children}
        </ChakraProvider>
    );
};
