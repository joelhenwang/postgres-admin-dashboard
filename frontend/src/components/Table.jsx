import * as React from "react";
import { DataGrid, useGridApiRef, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import EditBookingForm from './EditBookingForm';

function splitPascalCase(string) {
	let result = string.replace(/([A-Z])/g, " $1");
	return result;
}

export default function Table(props) {
	const [selectedRows, setSelectedRows] = useState([]);
	const [editingBooking, setEditingBooking] = useState(null);
	const apiRef = useGridApiRef();

	const handleEdit = (row) => {
		setEditingBooking(row);
	};
	
	let columns = props.columns.map((column) => {
		return {
			field: column.name,
			headerName: splitPascalCase(column.name),
			flex: 1,
			minWidth: 150,
		};
	});

	// Add edit action column if table is editable
	if (props.editable) {
		columns.unshift({
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<EditIcon />}
					label="Edit"
					onClick={() => handleEdit(params.row)}
				/>
			],
		});
	}


	let rows = props.rows;

	const handleSelectionChange = (selection) => {
		const selectedRowData = selection.map(id => 
			rows.find(row => row.id === id)
		);
		setSelectedRows(selectedRowData);
		if (props.onSelectionChange) {
			props.onSelectionChange(selectedRowData);
		}
	};

	return (
		<Box sx={{ 
			display: "flex", 
			flexDirection: "column",
			width: '100%',
			height: '100%',
			'& .MuiDataGrid-root': {
				border: 'none',
			},
			'& .MuiDataGrid-cell': {
				borderBottom: '1px solid #e0e0e0',
			},
			'& .MuiDataGrid-columnHeaders': {
				backgroundColor: '#f5f5f5',
				borderBottom: '2px solid #e0e0e0',
			},
		}}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
				<Typography variant="h6" component="h2">
					{props.title}
				</Typography>
			</Box>

			<DataGrid
				apiRef={apiRef}
				columns={columns}
				autosizeOnMount
				rows={rows}
				checkboxSelection
				onRowSelectionModelChange={handleSelectionChange}
				initialState={{
					pagination: { paginationModel: { pageSize: 25 } },
				}}
				pageSizeOptions={[10, 25, 50, 100]}
				autoHeight
				disableRowSelectionOnClick
				sx={{
					'& .MuiDataGrid-cell:focus': {
						outline: 'none',
					},
				}}
			/>

			{editingBooking && (
				<EditBookingForm
					booking={editingBooking}
					onClose={() => setEditingBooking(null)}
				/>
			)}
		</Box>
	);
}

Table.propTypes = {
	columns: PropTypes.array.isRequired,
	rows: PropTypes.array.isRequired,
	title: PropTypes.string,
	onSelectionChange: PropTypes.func,
	editable: PropTypes.bool,
};

Table.defaultProps = {
	editable: false,
};
