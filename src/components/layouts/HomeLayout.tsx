import {Box} from '@mui/material';
import {theme} from '@/utils/theme';

type LayoutProps = {
    children: React.ReactNode;
};
const HomeLayout = ({children}: LayoutProps): JSX.Element => {

    return (
        <Box sx={{background: theme.palette.primary.dark}}>{children}</Box>
    );
};

export default HomeLayout;
