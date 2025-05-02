import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const BotaoTranparente = styled(Button, {
    shouldForwardProp: (prop) =>
        ['component', 'to', 'href', 'variant'].includes(prop as string) || typeof prop === 'string',
})(({ theme }) => ({
    color: theme.palette.primary.main,
    borderBlockColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
}));
