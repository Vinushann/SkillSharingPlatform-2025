import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';

function Header() {
    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Toolbar>
                {/* Left: Search Icon */}
                <IconButton sx={{ mr: 2 }}>
                    <SearchIcon />
                </IconButton>

                {/* Center: Title */}
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        fontWeight: 'normal',
                    }}
                >
                    Home | Learning
                </Typography>

                {/* Right: Notification and Profile Icons */}
                <IconButton sx={{ mr: 1 }}>
                    <NotificationsIcon />
                </IconButton>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;