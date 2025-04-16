import * as React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/usersDataSlice";
import Table from "../components/Table";
import AddUserForm from "../components/AddUserForm";
import axiosInstance from "../utils/axiosConfig";
import SideBar from "../components/SideBar";

const Users = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [isDataReady, setIsDataReady] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { users, isLoadingUsers, errorUsers, usersLoaded } = useSelector(
    (state) => state.users
  );

  // Initial data fetch
  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  React.useEffect(() => {
    if (isLoadingUsers) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    if (!isLoadingUsers && !errorUsers && usersLoaded > 0) {
      setIsDataReady(true);
    }
  }, [isLoadingUsers, errorUsers, usersLoaded, setIsDataReady, setIsLoading]);

  const handleDeleteUsers = async () => {
    const usernames = selectedUsers.map((user) => user.username);
    try {
      await axiosInstance
        .delete("/users/delete/batch", {
          data: { usernames: usernames },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            dispatch(fetchUsers()).unwrap();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Failed to delete users");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <SideBar />
      <Container sx={{ mt: 4, mb: 4, ml: 2, width: "100%", height: "100%" }}>
        <Paper elevation={3} sx={{ p: 3, width: "90vw", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant="h4" component="h1">
              Users Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalOpen(true)}
              >
                Add User
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteUsers}
                disabled={selectedUsers.length === 0}
              >
                Delete Selected
              </Button>
            </Box>
          </Box>

          {isLoading ? (
            <Typography>Loading users...</Typography>
          ) : errorUsers ? (
            <Typography color="error">
              Error loading users: {errorUsers}
            </Typography>
          ) : isDataReady && users?.rows ? (
            <Table
              columns={users.fields}
              rows={users.rows}
              title="Users"
              onSelectionChange={setSelectedUsers}
            />
          ) : (
            <Typography>No users found</Typography>
          )}

          {modalOpen && <AddUserForm onClose={() => setModalOpen(false)} />}
        </Paper>
      </Container>
    </Box>
  );
};

export default Users;
