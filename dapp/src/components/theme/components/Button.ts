export const Button = {
    // 1. We can update the base styles
    baseStyle: {
        fontWeight: 'bold', // Normally, it is "semibold"
    },
    // 2. We can add a new button size or extend existing
    sizes: {
        xl: {
            h: '26px',
                fontSize: 'lg',
                px: '32px',
        },

    },
    colorScheme: 'pmpurple.13',
    // 3. We can add a new visual variant
    variants: {
        'with-shadow': {
            bg: 'red.400',
                boxShadow: '0 0 2px 2px #efdfde',
        },
        colorful: {
            item: {
                color: 'pmpurple.13'
            },
            // 4. We can override existing variants
            solid: (props: any) => ({
                bg: props.colorMode === 'dark' ? 'red.300' : 'red.500',
            }),
        },
    },
}
