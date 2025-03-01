import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'name', headerName: "Name"},
    { field: 'age', headerName: "Age"},
    { field: 'department', headerName: "Department"},
    { field: "salary", headerName: "Salary"}
]

const rows = [
    {
      id: 1,
      name: "Alice",
      age: 28,
      department: "Engineering",
      salary: 70000
    },
    {
      id: 2,
      name: "Bob",
      age: null,
      department: "Marketing",
      salary: 60000
    },
    {
      id: 3,
      name: "Charlie",
      age: 25,
      department: "",
      salary: 55000
    },
    {
      id: 4,
      name: "David",
      age: 30,
      department: "Human Resources",
      salary: null
    },
    {
      id: 5,
      name: "Eve",
      age: null,
      department: "",
      salary: null
    }
]
  


export default function Table() {
    return ( 
       <Box>
        <DataGrid
            columns={columns}
            rows={rows}
            checkboxSelection
            initialState={{
                pagination: { paginationModel: {pageSize: 25} },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
        />
       </Box>
    );
}