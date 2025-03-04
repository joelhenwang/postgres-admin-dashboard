import * as React from 'react'
import { Link as RouterLink} from 'react-router-dom'
import { Box, Button, Divider, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SideBar from '../components/SideBar';
import Table from '../components/Table';




const Home = () => {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row'}}>
        <SideBar/>
        
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: "auto", flexDirection: 'column', width: "auto", height: "95%", padding: 4}}>

          <Typography component={'h2'}>
            Database/Schema/Table
          </Typography>
        
          <Table/>
          
        </Box>
      </Box>
    </>
    )
}

export default Home
