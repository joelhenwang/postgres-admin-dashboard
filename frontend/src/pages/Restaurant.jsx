import * as React from "react";
import { useState, useMemo } from "react";
import { 
    Box, 
    Typography, 
    Button, 
    Container, 
    Paper, 
    CircularProgress, 
    Alert,
    IconButton,
    Badge,
    Stack
} from "@mui/material";
import { 
    Add as AddIcon,
    Delete as DeleteIcon,
    Restaurant as RestaurantIcon,
    Today as TodayIcon,
    NavigateBefore as PrevIcon,
    NavigateNext as NextIcon,
    LunchDining as LunchIcon,
    DinnerDining as DinnerIcon
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";
import SideBar from "../components/SideBar";
import AddBookingForm from "../components/AddBookingForm";
import EditBookingForm from "../components/EditBookingForm";
import BookingCard from "../components/BookingCard";
import axiosInstance from "../utils/axiosConfig";
import dayjs from "dayjs";

const Restaurant = () => {
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isDataReady, setIsDataReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [error, setError] = useState(null);

    const { bookings, isLoadingBookings, errorBookings } = useSelector(
        (state) => state.bookings
    );

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

    // Filter bookings by selected date
    const filteredBookings = useMemo(() => {
        if (!bookings?.rows) return [];
        
        const selectedDateStr = selectedDate.format('YYYY-MM-DD');
        return bookings.rows.filter(booking => 
            booking.booking_date === selectedDateStr
        );
    }, [bookings, selectedDate]);

    // Separate bookings by meal type
    const { lunchBookings, dinnerBookings } = useMemo(() => {
        const lunch = [];
        const dinner = [];
        
        filteredBookings.forEach(booking => {
            const bookingTime = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${booking.booking_hour}`, 'YYYY-MM-DD HH:mm');
            const hour = bookingTime.hour();
            
            if (hour >= 12 && hour < 17) {
                lunch.push(booking);
            } else {
                dinner.push(booking);
            }
        });
        
        // Sort by time
        lunch.sort((a, b) => dayjs(`2000-01-01 ${a.booking_hour}`, 'YYYY-MM-DD HH:mm').diff(dayjs(`2000-01-01 ${b.booking_hour}`, 'YYYY-MM-DD HH:mm')));
        dinner.sort((a, b) => dayjs(`2000-01-01 ${a.booking_hour}`, 'YYYY-MM-DD HH:mm').diff(dayjs(`2000-01-01 ${b.booking_hour}`, 'YYYY-MM-DD HH:mm')));
        
        return { lunchBookings: lunch, dinnerBookings: dinner };
    }, [filteredBookings, selectedDate]);

    const handleDateNavigation = (direction) => {
        if (direction === 'prev') {
            setSelectedDate(selectedDate.subtract(1, 'day'));
        } else {
            setSelectedDate(selectedDate.add(1, 'day'));
        }
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setShowEditForm(true);
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axiosInstance.delete(`/bookings/delete/${bookingId}`);
                dispatch(fetchBookings());
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('Failed to delete booking');
            }
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "100vh" }}>
            <SideBar />
            <Container sx={{ mt: 2, mb: 2, ml: 2, width: "100%", maxWidth: "none !important" }}>
                {/* Header */}
                <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <RestaurantIcon sx={{ fontSize: 32 }} />
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                Restaurant Dashboard
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowAddForm(true)}
                            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
                        >
                            Add Booking
                        </Button>
                    </Box>
                </Paper>

                {/* Date Navigation */}
                <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IconButton onClick={() => handleDateNavigation('prev')}>
                            <PrevIcon />
                        </IconButton>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TodayIcon sx={{ color: '#1976d2' }} />
                            <Typography variant="h5" sx={{ fontWeight: 500 }}>
                                {selectedDate.format('dddd, MMMM DD, YYYY')}
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => setSelectedDate(dayjs())}
                                disabled={selectedDate.isSame(dayjs(), 'day')}
                            >
                                Today
                            </Button>
                        </Box>
                        
                        <IconButton onClick={() => handleDateNavigation('next')}>
                            <NextIcon />
                        </IconButton>
                    </Box>
                </Paper>

                {/* Bookings Overview */}
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Lunch Section */}
                    <Box sx={{ flex: 1 }}>
                        <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <LunchIcon sx={{ fontSize: 28, color: '#ff9800' }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff9800' }}>
                                    Lunch
                                </Typography>
                                <Badge 
                                    badgeContent={lunchBookings.length} 
                                    color="primary"
                                    sx={{ ml: 1 }}
                                />
                            </Box>
                            
                            {lunchBookings.length > 0 ? (
                                <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                                    {lunchBookings.map((booking) => (
                                        <BookingCard
                                            key={booking.id}
                                            booking={booking}
                                            onEdit={handleEditBooking}
                                            onDelete={handleDeleteBooking}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <RestaurantIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                    <Typography variant="body1">
                                        No lunch bookings for this day
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>

                    {/* Dinner Section */}
                    <Box sx={{ flex: 1 }}>
                        <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <DinnerIcon sx={{ fontSize: 28, color: '#3f51b5' }} />
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#3f51b5' }}>
                                    Dinner
                                </Typography>
                                <Badge 
                                    badgeContent={dinnerBookings.length} 
                                    color="primary"
                                    sx={{ ml: 1 }}
                                />
                            </Box>
                            
                            {dinnerBookings.length > 0 ? (
                                <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
                                    {dinnerBookings.map((booking) => (
                                        <BookingCard
                                            key={booking.id}
                                            booking={booking}
                                            onEdit={handleEditBooking}
                                            onDelete={handleDeleteBooking}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <RestaurantIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                    <Typography variant="body1">
                                        No dinner bookings for this day
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Box>

                {/* Modals */}
                {showAddForm && (
                    <AddBookingForm onClose={() => setShowAddForm(false)} />
                )}
                
                {showEditForm && editingBooking && (
                    <EditBookingForm 
                        booking={editingBooking}
                        onClose={() => {
                            setShowEditForm(false);
                            setEditingBooking(null);
                        }} 
                    />
                )}
            </Container>
        </Box>
    );
};

export default Restaurant;