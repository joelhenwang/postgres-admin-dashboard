import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Modal, Box, Divider, Typography, Button } from "@mui/material";
import SideBar from "../components/SideBar";
import Table from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/usersDataSlice";
import { fetchBookings } from "../features/bookingsDataSlice";
import AddUserFormModal from "../components/AddUserForm";

const Admin = () => {
	const dispatch = useDispatch();

	const { users, isLoadingUsers, errorUsers, usersLoaded } = useSelector(
		(state) => state.users,
	);
	const { bookings, isLoadingBookings, errorBookings } = useSelector(
		(state) => state.bookings,
	);

	// States
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasError, setHasError] = React.useState(false);
	const [isDataReady, setIsDataReady] = React.useState(false);
	const [modalOpen, setModalOpen] = React.useState(false);
	// Inital call to fetch the data
	React.useEffect(() => {
		// TODO: Add the necessary dispatch calls to fetch the users and bookings
		dispatch(fetchUsers());
		dispatch(fetchBookings());
	}, [dispatch]);

	React.useEffect(() => {
		if (isLoadingUsers || isLoadingBookings) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}

		if (errorUsers || errorBookings) {
			setHasError(true);
		} else {
			setHasError(false);
		}

		if (!isLoading && !hasError && usersLoaded > 0) {
			setIsDataReady(true);
		}
	}, [
		isLoadingUsers,
		isLoadingBookings,
		users,
		usersLoaded,
		bookings,
		errorUsers,
		errorBookings,
		isLoading,
		hasError,
		setIsLoading,
		setHasError,
		setIsDataReady,
	]);	

	const renderUsersTable = () => {
		if (isDataReady) {
			
			return( 
			<>
				<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
					<AddUserFormModal onClose={() => setModalOpen(false)} />
				</Modal>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<h3>Users</h3>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button>Delete</Button>
						<Button onClick={() => setModalOpen(true)}>Add</Button>
					</Box>
				</Box>
				<Table columns={users.fields} rows={users.rows} title="Users" />;
			</>)
			}
	};

	const renderBookingTable = () => {
		if (isDataReady) {
			return (
			<>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<AddUserFormModal onClose={() => setModalOpen(false)} />
			</Modal>
			<Box sx={{ display: "flex", justifyContent: "space-between" }}></Box>	
				<Table
					columns={bookings.fields}
					rows={bookings.rows}
					title="Bookings"
				/>
			</>
			);
		}
	};

	const renderTables = () => {
		return (
			<>
				<Divider></Divider>
				{renderUsersTable()}
				<Divider sx={{ marginTop: 8, marginBottom: 4 }}></Divider>
				{renderBookingTable()}
			</>
		);
	};
	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row" }}>
				<SideBar />

				<Box
					sx={{
						display: "flex",
						flexGrow: 1,
						overflow: "auto",
						flexDirection: "column",
						width: "auto",
						height: "95%",
						padding: 4,
					}}
				>
					<Typography component={"h2"}>Admin Dashboard</Typography>

					{renderTables()}
				</Box>
			</Box>
		</>
	);
};

export default Admin;
