import theme from '../theme/theme';

const isTablet = () =>
    global?.window?.matchMedia(
    `(min-width: ${theme.breakpoint.max('medium')}) and (max-width: ${theme.breakpoint.max('large')})`
    ).matches;

export default isTablet;
