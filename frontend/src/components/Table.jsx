import * as React from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import PropTypes from "prop-types";
import AddUserFormModal from "./AddUserFormModal";
import { useState } from "react";

function splitPascalCase(string) {
	let result = string.replace(/([A-Z])/g, " $1");

	return result;
}

export default function Table(props) {
	const [modalOpen, setModalOpen] = useState();

	const apiRef = useGridApiRef();

	let columns = props.columns.map((column) => {
		return {
			field: column.name,
			headerName: splitPascalCase(column.name),
		};
	});

	React.useEffect(() => {
		if (props.columns.length > 0 && props.rows.length > 0) {
			apiRef.current.autosizeColumns({ includeHeaders: true });
		}
	}, [props.columns, props.rows, apiRef]);

	let rows = props.rows;
	console.log(rows);
	console.log(columns);

	const handleModalOpen = () => {
		setModalOpen(true);
	};
	const handleModalClose = () => {
		setModalOpen(false);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<Modal open={modalOpen} onClose={handleModalClose}>
				<AddUserFormModal></AddUserFormModal>
			</Modal>

			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<h3>{props.title}</h3>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button>Delete</Button>
					<Button onClick={handleModalOpen}>Add</Button>
				</Box>
			</Box>

			<DataGrid
				apiRef={apiRef}
				columns={columns}
				rows={rows}
				checkboxSelection
				initialState={{
					pagination: { paginationModel: { pageSize: 25 } },
				}}
				autosizeOnMount
				pageSizeOptions={[10, 25, 50, 100]}
			/>
		</Box>
	);
}

Table.propTypes = {
	columns: PropTypes.array.isRequired,
	rows: PropTypes.array.isRequired,
	title: PropTypes.string,
};
