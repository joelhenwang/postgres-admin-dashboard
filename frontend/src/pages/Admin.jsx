import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Modal, Box, Divider, Typography, Button } from "@mui/material";
import SideBar from "../components/SideBar";
import Table from "../components/Table";
import axiosInstance from "../utils/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/usersDataSlice";
import { fetchBookings } from "../features/bookingsDataSlice";
import AddUserFormModal from "../components/AddUserForm";

const Admin = () => {
  const dispatch = useDispatch();

  const { users, isLoadingUsers, errorUsers, usersLoaded } = useSelector(
    (state) => state.users
  );
  const { bookings, isLoadingBookings, errorBookings } = useSelector(
    (state) => state.bookings
  );

  // States
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isDataReady, setIsDataReady] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);

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

  const handleSelectUser = (username) => {
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, username]);
  };

  const handleDeleteUsers = async () => {
    const usernames = selectedUsers.map((user) => user.username);

    try {
      axiosInstance
        .delete("/users/delete/batch", {
          data: {
            usernames: usernames,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const renderUsersTable = () => {
    if (isDataReady) {
      return (
        <>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <AddUserFormModal onClose={() => setModalOpen(false)} />
          </Modal>
          <Table
            columns={users.fields}
            rows={users.rows}
            title="Users"
            onSelectionChange={(selectedRows) => setSelectedUsers(selectedRows)}
          />
          <br />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "row-reverse",
                width: "100%",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setModalOpen(true)}
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  border: "1px solid #1565c0",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Add
              </Button>
              <Button
                onClick={handleDeleteUsers}
                variant="contained"
                sx={{
                  backgroundColor: "#d32f2f",
                  border: "1px solid #c62828",
                  "&:hover": {
                    backgroundColor: "#c62828",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </>
      );
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
