import * as React from "react";
import { Box, Typography, Button, Container, Paper, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";
import Table from "../components/Table";
import axiosInstance from "../utils/axiosConfig";
import SideBar from "../components/SideBar";
import AddBookingForm from "../components/AddBookingForm";

const Bookings = () => {
  const dispatch = useDispatch();
  const [selectedBookings, setSelectedBookings] = React.useState([]);
  const [isDataReady, setIsDataReady] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);

  const { bookings, isLoadingBookings, errorBookings } = useSelector(
    (state) => state.bookings
  );
  

  // Initial data fetch
  React.useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  React.useEffect(() => {
    if (isLoadingBookings) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    if (!isLoadingBookings && !errorBookings && bookings?.rows?.length > 0) {
      setIsDataReady(true);
    }
  }, [isLoadingBookings, errorBookings, bookings, setIsDataReady, setIsLoading]);

  const handleDeleteBookings = async () => {
    const bookingIds = selectedBookings.map((booking) => booking.id);
    try {
      await axiosInstance
        .delete("/bookings/delete/batch", {
          data: { bookingIds: bookingIds },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            dispatch(fetchBookings()).unwrap();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error deleting bookings:", error);
      alert("Failed to delete bookings");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorBookings) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{errorBookings}</Alert>
      </Box>
    );
  }

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
              Bookings Management
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteBookings}
                disabled={selectedBookings.length === 0}
              >
                Delete Selected
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddForm(true)}
              >
                Add Booking
              </Button>
            </Box>
          </Box>

          {isDataReady && bookings?.rows ? (
            <Table
              columns={bookings.fields}
              rows={bookings.rows}
              title="Bookings"
              onSelectionChange={setSelectedBookings}
              editable={true}
            />
          ) : (
            <Typography>No bookings found</Typography>
          )}
        </Paper>

        {showAddForm && (
          <AddBookingForm onClose={() => setShowAddForm(false)} />
        )}
      </Container>
    </Box>
  );
};

export default Bookings; 