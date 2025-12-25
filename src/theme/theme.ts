import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { popoverRecipe } from '@theme/popover.recipe';
import { drawerRecipe } from '@theme/drawer.recipe';
import { cardRecipe } from '@theme/card.recipe';
import { dialogRecipe } from '@theme/dialog.recipe';
import { tableRecipe } from '@theme/table.recipe';

export const colorModeConfig = { forcedTheme: 'dark' };

const themeConfig = defineConfig({
    globalCss: { body: { fontSize: 'sm' } },
    theme: {
        tokens: {
            fonts: {
                body: { value: 'PlayStation, system-ui' },
                heading: { value: 'PlayStation, system-ui' },
            },
            fontSizes: {
                '2xs': { value: '0.625rem' },
                xs: { value: '0.75rem' },
                sm: { value: '0.975rem' },
                md: { value: '1rem' },
                lg: { value: '1.125rem' },
                xl: { value: '1.75rem' },
                '2xl': { value: '2.5rem' },
                '3xl': { value: '2.875rem' },
                '4xl': { value: '3.25rem' },
                '5xl': { value: '3rem' },
                '6xl': { value: '3.75rem' },
                '7xl': { value: '4.5rem' },
            },
            zIndex: { dropdown: { value: 1600 } },
            colors: {
                red: { DEFAULT: { value: '#B62F28' }, hover: { value: '#E93F36' } },
                blue: { DEFAULT: { value: '#3E8CA5' }, hover: { value: '#49a7c6' } },
                green: { DEFAULT: { value: '#4EA35B' }, hover: { value: '#5dc66d' } },
                orange: { DEFAULT: { value: '#F19C42' }, hover: { value: '#ffb544' } },
                purple: { DEFAULT: { value: '#873ea5' }, hover: { value: '#a149c6' } },
            },
            gradients: { psone: { value: 'linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))' } },
            animations: { rainbow: { value: 'rainbow 3s linear infinite' } },
        },
        keyframes: {
            rainbow: {
                '0%': { backgroundPosition: '0% center' },
                '100%': { backgroundPosition: '-200% center' },
            },
        },
        slotRecipes: {
            popover: popoverRecipe,
            drawer: drawerRecipe,
            card: cardRecipe,
            dialog: dialogRecipe,
            table: tableRecipe,
        },
    },
});

export default createSystem(defaultConfig, themeConfig);
