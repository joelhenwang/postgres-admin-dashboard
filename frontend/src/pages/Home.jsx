import * as React from 'react'
import { Link as RouterLink} from 'react-router-dom'
import { Box, Button, Divider, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SideBar from '../components/SideBar';




const Home = () => {

  return (
    <>
      <Box sx={{ display: 'flex'}}>
        <SideBar/>
      </Box>
    </>
    )
}

export default Home
