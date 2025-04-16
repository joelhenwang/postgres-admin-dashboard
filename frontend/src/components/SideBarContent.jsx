import * as React from 'react';
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
  { text: 'Home', icon: <HomeRoundedIcon fontSize='large'/> , route: '/'},
  { text: 'Users', icon: <PeopleRoundedIcon fontSize='large'/> , route: '/users'},
  { text: 'Bookings', icon: <AssignmentRoundedIcon fontSize='large'/> , route: '/bookings'},
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon fontSize='large'/> },
  { text: 'About', icon: <InfoRoundedIcon fontSize='large'/> },
  { text: 'Feedback', icon: <HelpRoundedIcon fontSize='large'/> },
];

export default function SideBarContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between', padding: '0px 0px'}}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
