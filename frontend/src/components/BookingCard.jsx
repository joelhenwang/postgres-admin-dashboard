import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import {
    AccessTime as TimeIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    EventNote as NoteIcon,
    TableRestaurant as TableIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as ConfirmedIcon,
    Schedule as UnconfirmedIcon,
    HowToReg as ArrivedIcon,
    ArrowDropDown as ArrowDropDownIcon
} from "@mui/icons-material";
import axiosInstance from '../utils/axiosConfig';

const BookingCard = ({ booking, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return { color: '#4caf50', bg: '#e8f5e8' };
            case 'arrived':
                return { color: '#2196f3', bg: '#e3f2fd' };
            case 'unconfirmed':
            default:
                return { color: '#ff9800', bg: '#fff3e0' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return <ConfirmedIcon sx={{ fontSize: 16 }} />;
            case 'arrived':
                return <ArrivedIcon sx={{ fontSize: 16 }} />;
            case 'unconfirmed':
            default:
                return <UnconfirmedIcon sx={{ fontSize: 16 }} />;
        }
    };

    const handleStateClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleStateClose = () => {
        setAnchorEl(null);
    };

    const handleStateSelect = (newState) => {
        setSelectedState(newState);
        handleStateClose();
        setConfirmDialogOpen(true);
    };

    const handleConfirmStateChange = async () => {
        setIsUpdating(true);
        try {
            const bookingData = {
                ...booking,
                booking_state: selectedState
            };
            await axiosInstance.put(`/bookings/update/${booking.id}`, bookingData);
            // Refresh the bookings list
            window.location.reload();
        } catch (error) {
            console.error('Error updating booking state:', error);
            alert('Failed to update booking state');
        } finally {
            setIsUpdating(false);
            setConfirmDialogOpen(false);
        }
    };

    const statusStyle = getStatusColor(booking.booking_state);
    
    return (
        <>
            <Card 
                sx={{ 
                    mb: 1.5, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: 'white',
                    transition: 'all 0.05s',
                    '&:hover': {
                        border: '2px solid #1976d2',
                        backgroundColor: '#f8f9fa'
                    }
                }}
            >
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {booking.booking_hour}
                            </Typography>
                        </Box>
                        <Chip
                            icon={getStatusIcon(booking.booking_state)}
                            label={booking.booking_state || 'unconfirmed'}
                            size="small"
                            onClick={handleStateClick}
                            onDelete={handleStateClick}
                            deleteIcon={<ArrowDropDownIcon />}
                            sx={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                height: 24,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: statusStyle.bg,
                                    opacity: 0.9
                                }
                            }}
                        />
                    </Box>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon sx={{ fontSize: 14, color: '#666' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {booking.booking_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ({booking.booking_guests})
                            </Typography>
                        </Box>
                        
                        {booking.booking_table && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TableIcon sx={{ fontSize: 14, color: '#666' }} />
                                <Typography variant="caption" color="text.secondary">
                                    Table {booking.booking_table}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
                        {booking.booking_contact && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 12, color: '#666' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {booking.booking_contact}
                                </Typography>
                            </Box>
                        )}
                        {booking.booking_email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 12, color: '#666' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {booking.booking_email}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                    
                    {booking.booking_note && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <NoteIcon sx={{ fontSize: 12, color: '#666' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {booking.booking_note}
                            </Typography>
                        </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Edit Booking">
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(booking);
                                }}
                                sx={{ 
                                    color: '#1976d2',
                                    padding: '4px'
                                }}
                            >
                                <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Booking">
                            <IconButton 
                                size="small" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(booking.id);
                                }}
                                sx={{ 
                                    color: '#d32f2f',
                                    padding: '4px'
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>

            {/* State Selection Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleStateClose}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={() => handleStateSelect('Unconfirmed')}>
                    <UnconfirmedIcon sx={{ fontSize: 16, mr: 1, color: '#ff9800' }} />
                    Unconfirmed
                </MenuItem>
                <MenuItem onClick={() => handleStateSelect('Confirmed')}>
                    <ConfirmedIcon sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                    Confirmed
                </MenuItem>
                <MenuItem onClick={() => handleStateSelect('Arrived')}>
                    <ArrivedIcon sx={{ fontSize: 16, mr: 1, color: '#2196f3' }} />
                    Arrived
                </MenuItem>
            </Menu>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle>Confirm State Change</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to change the booking state to "{selectedState}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmDialogOpen(false)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmStateChange}
                        variant="contained"
                        disabled={isUpdating}
                        color="primary"
                    >
                        {isUpdating ? 'Updating...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingCard; 