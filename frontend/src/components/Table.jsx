import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

function splitPascalCase(string) {
  let result = string.replace(/([A-Z])/g, " $1");
  
  return result;
};


  


export default function Table(props) {
  
  
  let columns = props.columns.map( (column) => {
    
    return {
      field: column.name,
      headerName: splitPascalCase(column.name)
    }
  });

  let rows = props.rows;
  console.log(rows);
  console.log(columns);  
  
  
  return ( 
      <Box sx={{ display:"flex" }}>
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

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
};