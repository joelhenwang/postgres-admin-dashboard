import { useState, useEffect } from "react";
import {
    Button,
    Box,
    FormControl,
    FormLabel,
    TextField,
    Modal,
    Select,
    MenuItem,
} from "@mui/material";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import axiosInstance from '../utils/axiosConfig';
import dayjs from "dayjs";
import isTodayPlugin from 'dayjs/plugin/isToday';
import { useDispatch } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";

dayjs.extend(isTodayPlugin);

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "720px",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    display: "grid",
    gap: 4,
    gridTemplateColumns: "repeat(2,1fr)",
    p: 4,
};

const EditBookingForm = ({ booking, onClose }) => {
    const [restaurant, setRestaurant] = useState(booking.booking_restaurant || "");
    const [hour, setHour] = useState(booking.booking_hour ? dayjs(booking.booking_hour, "HH:mm") : null);
    const [date, setDate] = useState(booking.booking_date ? dayjs(booking.booking_date) : null);
    const [guests, setGuests] = useState(booking.booking_guests || "");
    const [name, setName] = useState(booking.booking_name || "");
    const [email, setEmail] = useState(booking.booking_email || "");
    const [phone, setPhone] = useState(booking.booking_contact || "");
    const [table, setTable] = useState(booking.booking_table || "");
    const [booking_note, setBookingNote] = useState(booking.booking_note || "");
    const [booking_state, setBookingState] = useState(booking.booking_state || "");
    const [isWaiting, setIsWaiting] = useState(false);
    const [meal, setMeal] = useState(hour ? (hour.hour() < 16 ? "Lunch" : "Dinner") : "");
    const [maxBookTime, setMaxBookTime] = useState(null);
    const [minBookTime, setMinBookTime] = useState(null);
    const [isDateToday, setIsDateToday] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const dispatch = useDispatch();

    // Effect to track changes
    useEffect(() => {
        const isChanged = 
            restaurant !== booking.booking_restaurant ||
            guests !== booking.booking_guests ||
            name !== booking.booking_name ||
            email !== booking.booking_email ||
            phone !== booking.booking_contact ||
            table !== booking.booking_table ||
            booking_note !== booking.booking_note ||
            booking_state !== booking.booking_state ||
            (date && date.format('YYYY-MM-DD') !== booking.booking_date) ||
            (hour && hour.format('HH:mm') !== booking.booking_hour);
        
        setHasChanges(isChanged);
    }, [restaurant, hour, date, guests, name, email, phone, table, booking_note, booking_state]);

    // Effect to update time constraints when date or meal changes
    useEffect(() => {
        if (date && meal) {
            const selectedDayjsDate = dayjs(date);
            const today = dayjs();
            const isToday = selectedDayjsDate.isToday();
            setIsDateToday(isToday);

            let minTime, maxTime;

            if (meal === "Lunch") {
                minTime = selectedDayjsDate.set("hour", 12).set("minute", 0);
                maxTime = selectedDayjsDate.set("hour", 15).set("minute", 0);
            } else if (meal === "Dinner") {
                minTime = selectedDayjsDate.set("hour", 19).set("minute", 30);
                maxTime = selectedDayjsDate.set("hour", 23).set("minute", 0);
            }

            if (isToday && minTime && today.isAfter(minTime)) {
                const currentMinutes = today.minute();
                const roundedUpTime = currentMinutes < 30
                    ? today.minute(30).second(0)
                    : today.add(1, 'hour').minute(0).second(0);

                if (roundedUpTime.isAfter(minTime)) {
                    minTime = roundedUpTime;
                }
            }

            setMinBookTime(minTime);
            setMaxBookTime(maxTime);
        } else {
            setMinBookTime(null);
            setMaxBookTime(null);
            setIsDateToday(false);
        }
    }, [date, meal]);

    const handleDateChange = (newDate) => {
        setDate(dayjs(newDate));
        setMeal("");
        setHour(null);
    };

    const handleMealChange = (event) => {
        setMeal(event.target.value);
        setHour(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!hasChanges) {
            onClose();
            return;
        }

        setIsWaiting(true);
        
        const bookingData = {
            id: booking.id,
            booking_restaurant: restaurant,
            booking_date: date.format('YYYY-MM-DD'),
            booking_hour: hour ? hour.format('HH:mm') : null,
            booking_guests: parseInt(guests),
            booking_name: name,
            booking_email: email,
            booking_contact: phone,
            booking_table: table,
            booking_state: booking_state,
            booking_note: booking_note
        };

        try {
            await axiosInstance.put(`/bookings/update/${booking.id}`, bookingData);
            await dispatch(fetchBookings()).unwrap();
            onClose();
        } catch (e) {
            console.error("Could not update booking", e);
            alert("Could not update booking");
        } finally {
            setIsWaiting(false);
        }
    };

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box component="form" onSubmit={handleSubmit} sx={style}>
                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="date">Date</FormLabel>
                    <DatePicker
                        id="date"
                        name="date"
                        value={date}
                        onChange={handleDateChange}
                        required
                        disablePast
                        views={["year", "month", "day"]}
                    />
                </FormControl>

                <FormControl disabled={isWaiting} sx={{padding: 0}}>
                    <FormLabel htmlFor="hour">Hour</FormLabel>    
                    <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>    
                        <Select
                            labelId="meal-label"
                            id="meal"
                            value={meal}
                            onChange={handleMealChange}
                            required
                            sx={{width: "100%"}}
                            disabled={!date}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Meal</MenuItem>
                            <MenuItem value="Lunch">Lunch</MenuItem>
                            <MenuItem value="Dinner">Dinner</MenuItem>
                        </Select>
                        <TimePicker
                            id="hour"
                            name="hour"
                            value={hour}
                            onChange={(newValue) => setHour(newValue)}
                            views={["hours", "minutes"]}
                            disabled={!meal || !minBookTime || !maxBookTime}
                            sx={{width: "100%"}}
                            disablePast={isDateToday}
                            skipDisabled
                            minTime={minBookTime}
                            maxTime={maxBookTime}
                            timeSteps={{
                                hours: 1,
                                minutes: 30,
                            }}
                            ampm={false}
                        />
                    </div>
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="restaurant">Restaurant</FormLabel>
                    <Select
                        labelId="restaurant"
                        id="restaurant"
                        value={restaurant}
                        label="Restaurant"
                        onChange={(e) => setRestaurant(e.target.value)}
                        required
                    >
                        <MenuItem value="Sao Sebastiao">Sao Sebastiao</MenuItem>
                        <MenuItem value="Entrecampos">Entrecampos</MenuItem>
                        <MenuItem value="Telheiras">Telheiras</MenuItem>
                    </Select>
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="guests">No. of Guests</FormLabel>
                    <TextField
                        id="guests"
                        name="guests"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        required
                        variant="outlined"
                        InputProps={{
                            inputProps: { min: 1 }
                        }}
                    />
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="table">Table</FormLabel>
                    <TextField
                        id="table"
                        name="table"
                        value={table}
                        onChange={(e) => setTable(e.target.value)}
                        variant="outlined"
                    />
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <TextField
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        variant="outlined"
                    />
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                    />
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="phone">Phone</FormLabel>
                    <TextField
                        id="phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        variant="outlined"
                    />
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="state">State</FormLabel>
                    <Select
                        labelId="state"
                        id="state"
                        value={booking_state}
                        label="State"
                        onChange={(e) => setBookingState(e.target.value)}
                        required
                    >
                        <MenuItem value="Unconfirmed">Unconfirmed</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Arrived">Arrived</MenuItem>
                    </Select>
                </FormControl>

                <FormControl disabled={isWaiting}>
                    <FormLabel htmlFor="note">Note</FormLabel>
                    <TextField
                        id="note"
                        name="note"
                        value={booking_note}
                        onChange={(e) => setBookingNote(e.target.value)}
                        variant="outlined"
                    />
                </FormControl>

                <Box></Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 1, gridColumn: '1 / -1' }}>
                    <Button onClick={onClose} variant="outlined" disabled={isWaiting}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isWaiting || !hour || !hasChanges}
                        color={hasChanges ? "primary" : "inherit"}
                    >
                        {isWaiting ? 'Updating...' : 'Update Booking'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

EditBookingForm.propTypes = {
    booking: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditBookingForm; 