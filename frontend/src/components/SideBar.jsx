import { Box, Divider, IconButton } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer,{ drawerClasses } from "@mui/material/Drawer";
import MuiBox from "@mui/material/Box";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from "react";
import SelectTable from "./SelectTable";
import SideBarContent from "./SideBarContent";


const sidebarWidth = 240;

const openedMixin = (theme) => ({
    width: sidebarWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 2px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 2px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            justifyContent: 'space-between',
            paddingTop: 12,
            paddingBottom: 12 
        },
        variants: [
        {
            props: ({ open }) => open,
            style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
        ],
    }),
);

const DrawerFooter = styled(MuiBox, { shouldForwardProp: (prop) => prop !== 'open'}) (
    () => ({
        display: 'flex',
        flexDirection: 'row-reverse',
        width: '100%',
        variants:[
            { 
                props: ({open}) => open,
                style: {
                    justifyContent:'normal', 
                    paddingRight: 12,
                }
            },
            { 
                props: ({open}) => !open,
                style: {
                    justifyContent:'center' 
                }
            }
        ]
    })
)

export default function SideBar() {
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleDrawerState = () => {
        setIsOpen(!isOpen)
    };
    
    return (
        <Drawer variant="permanent" open={isOpen}>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                <SelectTable open={isOpen} />
            </Box>
            
            
            <Box style={{display:'flex', flexDirection: 'column',height:'100%'}}>
                <SideBarContent/>
            </Box>
            
            <DrawerFooter open={isOpen}>
                <IconButton onClick={toggleDrawerState} >
                    {isOpen ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </DrawerFooter>
        </Drawer>
    )
}