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
  const {users, isLoadingUsers, errorUsers, usersLoaded} = useSelector((state) => state.users);
  const {bookings, isLoadingBookings, errorBookings} = useSelector((state) => state.bookings);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isDataReady, setIsDataReady] = React.useState(false);
  // Inital call to fetch the data
  React.useEffect(() => {
    // TODO: Add the necessary dispatch calls to fetch the users and bookings
    dispatch(fetchUsers());
    dispatch(fetchBookings()); 
    
  },[dispatch]);
  

  React.useEffect(() => {
    if (isLoadingUsers || isLoadingBookings) {
      setIsLoading(true);
    }
    else {
      setIsLoading(false);
    }

    if (errorUsers || errorBookings) {
      setHasError(true);
    }
    else {
      setHasError(false);
    }

    if (!isLoading && !hasError && usersLoaded > 0 ) {
      setIsDataReady(true);
    }
  }, [isLoadingUsers, isLoadingBookings, users, usersLoaded, bookings, errorUsers, errorBookings, isLoading, hasError, setIsLoading, setHasError, setIsDataReady]);


  const renderTable = () =>{
    if (isDataReady) {
      return <Table columns={users.fields} rows={users.rows} />
    }
  }
  
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row'}}>
        <SideBar/>
        
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: "auto", flexDirection: 'column', width: "auto", height: "95%", padding: 4}}>

          <Typography component={'h2'}>
            Admin Dashboard
          </Typography>
          
          {renderTable()}
        </Box>
      </Box>
    </>
    )
}

export default Admin
