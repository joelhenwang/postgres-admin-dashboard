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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from "@mui/material";
import { 
    Add as AddIcon,
    Delete as DeleteIcon,
    Restaurant as RestaurantIcon,
    Today as TodayIcon,
    NavigateBefore as PrevIcon,
    NavigateNext as NextIcon,
    LunchDining as LunchIcon,
    DinnerDining as DinnerIcon,
    ExpandMore as ExpandMoreIcon
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
    
    // Accordion states for Lunch and Dinner sections
    const [expandedAccordions, setExpandedAccordions] = useState(['lunch', 'dinner']); // Both expanded by default

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

    // Handle accordion expansion
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        if (isExpanded) {
            setExpandedAccordions(prev => [...prev, panel]);
        } else {
            setExpandedAccordions(prev => prev.filter(item => item !== panel));
        }
    };

    const renderBookingsInAccordion = (bookingsList, mealType) => (
        <Box sx={{ width: '100%' }}>
            {bookingsList.length > 0 ? (
                <Box sx={{ 
                    display: 'grid', 
                    gap: 2, 
                    gridTemplateColumns: { 
                        xs: '1fr', 
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    maxHeight: '70vh', 
                    overflowY: 'auto', 
                    pl: 1,
                    pr: 1,
                    pt: 2
                }}>
                    {bookingsList.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onEdit={handleEditBooking}
                            onDelete={handleDeleteBooking}
                        />
                    ))}
                </Box>
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 4, 
                    color: 'text.secondary' 
                }}>
                    <RestaurantIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No {mealType} bookings
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                        No bookings scheduled for {mealType} on {selectedDate.format('MMMM DD, YYYY')}
                    </Typography>
                </Box>
            )}
        </Box>
    );

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
            
            {/* Main Content */}
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

                {/* Summary Statistics */}
                <Paper elevation={1} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                        Today's Overview
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                {filteredBookings.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Bookings
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                                {lunchBookings.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lunch
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#3f51b5' }}>
                                {dinnerBookings.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Dinner
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Accordion Sections */}
                <Box sx={{ mb: 3 }}>
                    {/* Lunch Accordion */}
                    <Accordion 
                        expanded={expandedAccordions.includes('lunch')}
                        onChange={handleAccordionChange('lunch')}
                        sx={{ 
                            mb: 2,
                            '&.Mui-expanded': {
                                margin: '0 0 16px 0'
                            },
                            '&:before': {
                                display: 'none'
                            },
                            boxShadow: 2
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                color: 'white',
                                '& .MuiAccordionSummary-content': {
                                    alignItems: 'center'
                                },
                                '&.Mui-expanded': {
                                    minHeight: 48
                                },
                                '& .MuiAccordionSummary-content.Mui-expanded': {
                                    margin: '12px 0'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                <LunchIcon sx={{ fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Lunch Bookings
                                </Typography>
                                <Badge 
                                    badgeContent={lunchBookings.length} 
                                    color="error"
                                    sx={{ 
                                        '& .MuiBadge-badge': { 
                                            backgroundColor: 'white', 
                                            color: '#ff9800',
                                            fontWeight: 'bold'
                                        } 
                                    }}
                                />
                                <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
                                    12:00 PM - 5:00 PM
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            {renderBookingsInAccordion(lunchBookings, 'lunch')}
                        </AccordionDetails>
                    </Accordion>

                    {/* Dinner Accordion */}
                    <Accordion 
                        expanded={expandedAccordions.includes('dinner')}
                        onChange={handleAccordionChange('dinner')}
                        sx={{ 
                            mb: 2,
                            '&.Mui-expanded': {
                                margin: '0 0 16px 0'
                            },
                            '&:before': {
                                display: 'none'
                            },
                            boxShadow: 2
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                                background: 'linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)',
                                color: 'white',
                                '& .MuiAccordionSummary-content': {
                                    alignItems: 'center'
                                },
                                '&.Mui-expanded': {
                                    minHeight: 48
                                },
                                '& .MuiAccordionSummary-content.Mui-expanded': {
                                    margin: '12px 0'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                <DinnerIcon sx={{ fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Dinner Bookings
                                </Typography>
                                <Badge 
                                    badgeContent={dinnerBookings.length} 
                                    color="error"
                                    sx={{ 
                                        '& .MuiBadge-badge': { 
                                            backgroundColor: 'white', 
                                            color: '#3f51b5',
                                            fontWeight: 'bold'
                                        } 
                                    }}
                                />
                                <Typography variant="body2" sx={{ ml: 'auto', opacity: 0.9 }}>
                                    7:30 PM - 11:00 PM
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            {renderBookingsInAccordion(dinnerBookings, 'dinner')}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Container>

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
        </Box>
    );
};

export default Restaurant;