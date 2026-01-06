import theme from '../theme/theme';

const isMobile = () => global?.window?.matchMedia(`(max-width: ${theme.breakpoint.max('medium')})`).matches;

export default isMobile;
