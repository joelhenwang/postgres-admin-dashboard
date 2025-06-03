import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon fontSize='large'/> , route: '/home'},
  { text: 'Users', icon: <PeopleRoundedIcon fontSize='large'/> , route: '/users'},
  { text: 'Bookings', icon: <AssignmentRoundedIcon fontSize='large'/> , route: '/bookings'},
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon fontSize='large'/>, route: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon fontSize='large'/>, route: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon fontSize='large'/>, route: '/feedback' },
];

export default function SideBarContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between', padding: '0px 0px'}}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={location.pathname === item.route}
              onClick={() => handleNavigation(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={location.pathname === item.route}
              onClick={() => handleNavigation(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
