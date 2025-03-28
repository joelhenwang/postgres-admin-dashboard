import * as React from 'react'
import { Link as RouterLink} from 'react-router-dom'
import { Box, Button, Divider, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SideBar from '../components/SideBar';
import Table from '../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers} from '../features/usersDataSlice';
import { fetchBookings } from '../features/bookingsDataSlice';




const Admin = () => {
  const dispatch = useDispatch();
  // TODO: Add the necessary variables to the useSelector function
  const {users, isLoadingUsers, errorUsers} = useSelector((state) => state.users);
  const {bookings, isLoadingBookings, errorBookings} = useSelector((state) => state.bookings);

  // Inital call to fetch the data
  React.useEffect(() => {
    // TODO: Add the necessary dispatch calls to fetch the users and bookings
    dispatch(fetchUsers());
    dispatch(fetchBookings()); 
    
  },[dispatch]);
  
  React.useEffect(() => {
    console.log("State of users and bookings"); 
    console.log(users);
    console.log(bookings);
  }, [users, bookings]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row'}}>
        <SideBar/>
        
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: "auto", flexDirection: 'column', width: "auto", height: "95%", padding: 4}}>

          <Typography component={'h2'}>
            Admin Dashboard
          </Typography>
        
          <Table/>
          
        </Box>
      </Box>
    </>
    )
}

export default Admin
