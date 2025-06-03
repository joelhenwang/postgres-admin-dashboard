import { useState, useEffect } from "react"; // Import useEffect
import {
	Button,
	Box,
	FormControl,
	FormLabel,
	TextField,
	Modal,
	Select,
	InputLabel,
	MenuItem,
	Container,
} from "@mui/material";
import { TimePicker, DatePicker} from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import axiosInstance from '../utils/axiosConfig';
import dayjs from "dayjs";
import isTodayPlugin from 'dayjs/plugin/isToday'; // Import isToday plugin
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";

dayjs.extend(isTodayPlugin); // Extend dayjs with the plugin
dayjs.extend(utc);
dayjs.extend(timezone);

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

const AddBookingForm = (props) => {
	// States
	const [restaurant, setRestaurant] = useState("");
	const [hour, setHour] = useState(null); // Initialize hour as null
	const [date, setDate] = useState(null);
	const [guests, setGuests] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [table, setTable] = useState("");
	const [booking_note, setBookingNote] = useState("");
	const [booking_state, setBookingState] = useState("");
	const [isWaiting, setIsWaiting] = useState(false);
	const [meal, setMeal] = useState("");
	const [maxBookTime, setMaxBookTime] = useState(null);
	const [minBookTime, setMinBookTime] = useState(null);
	const [isDateToday, setIsDateToday] = useState(false); // State to track if selected date is today
	
	const {user, error} = useSelector((state) => state.auth); // Get user and error from auth slice

	const dispatch = useDispatch();


	// Effect to update time constraints when date or meal changes
	useEffect(() => {
		if (date && meal) {
			const selectedDayjsDate = dayjs(date);
			const today = dayjs();
			const isToday = selectedDayjsDate.isToday();
			setIsDateToday(isToday); // Update the state

			let minTime, maxTime;

			if (meal === "Lunch") {
				minTime = selectedDayjsDate.set("hour", 12).set("minute", 0).set("second", 0);
				maxTime = selectedDayjsDate.set("hour", 15).set("minute", 0).set("second", 0);
			} else if (meal === "Dinner") {
				minTime = selectedDayjsDate.set("hour", 19).set("minute", 30).set("second", 0);
				maxTime = selectedDayjsDate.set("hour", 23).set("minute", 0).set("second", 0);
			}

			// If the selected date is today, ensure minTime is not in the past relative to now
			if (isToday && minTime && today.isAfter(minTime)) {
				// Round current time up to the nearest 30 minutes for comparison/setting
				const currentMinutes = today.minute();
				const roundedUpTime = currentMinutes < 30
					? today.minute(30).second(0).millisecond(0)
					: today.add(1, 'hour').minute(0).second(0).millisecond(0);

				// Only update minTime if the rounded up current time is later than the meal start time
				if (roundedUpTime.isAfter(minTime)) {
					minTime = roundedUpTime;
				}
			}

			setMinBookTime(minTime);
			setMaxBookTime(maxTime);

			// Reset hour if it's outside the new valid range

		} else {
			// Reset times if date or meal is not selected
			setMinBookTime(null);
			setMaxBookTime(null);
			setIsDateToday(false);
		}
	}, [date, meal]); // Add hour to dependencies to re-validate

	// Handle restaurant selection
	const handleRestaurantChange = (event) => {
		setRestaurant(event.target.value);
	}

	// Handle booking date selection
	const handleDateChange = (newDate) => {
		if (!newDate) {
			setDate(null);
			return;
		}

		const selectedDate = dayjs(newDate);
		const today = dayjs().startOf('day');
		
		// Validate date is not in the past
		if (selectedDate.isBefore(today)) {
			alert('Cannot select a date in the past');
			return;
		}

		setDate(selectedDate);
		setMeal("");
		setHour(null);
	};

	// Handle meal selection
	const handleMealChange = (event) => {
		setMeal(event.target.value);
		// Reset hour when meal changes
		setHour(null);
	}

	// Handle submission
	async function handleSubmit(event) {
		event.preventDefault();
		setIsWaiting(true);
		
		const user = JSON.parse(localStorage.getItem("user"));
		const username = user.username;

		// Ensure date is in local timezone
		const localDate = date.tz(dayjs.tz.guess());
		
		const bookingData = {
			booking_restaurant: restaurant,
			booking_date: localDate.format('YYYY-MM-DD'),
			booking_hour: hour ? hour.format('HH:mm') : null,
			booking_guests: parseInt(guests),
			booking_name: name,
			booking_email: email,
			booking_contact: phone,
			booking_table: table,
			booking_state: booking_state,
			booking_note: booking_note,
			booking_created_by: username,
		};

		console.log("Booking Data:", bookingData); // Log the booking data
		console.log("date: ", localDate.format('YYYY-MM-DD'));
		
		
		try {
			const response = await axiosInstance.post("/bookings/add", bookingData);
			console.log(response);
			// Refresh the bookings table after successful addition
			await dispatch(fetchBookings()).unwrap();
			props.onClose();
		} catch (e) {
			console.error("Could not send request to add booking", e);
			alert("Could not send request to add booking");
		} finally {
			setIsWaiting(false);
		}
	}

	return (
		<Modal
			open={true}
			onClose={props.onClose}
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
						disablePast // Prevent selecting past dates
						views={["year", "month", "day"]} // Show year, month, and day views


					>
					</DatePicker>
				</FormControl>

				<FormControl disabled={isWaiting} sx={{padding: 0}}>
					<FormLabel htmlFor="hour">Hour</FormLabel>	
						<div style={{display: "flex", flexDirection: "row", gap: "10px"}}>	
							<Select
								labelId="meal-label" // Add a labelId for accessibility
								id="meal"
								value= {meal}
								// label="Lunch/Dinner" // Use InputLabel component instead for Select
								onChange={handleMealChange}
								required
								sx={{width: "100%"}}
								disabled={!date} // Disable if date is not selected
								displayEmpty // Allows placeholder/label behavior
							>
								{/* Consider adding an InputLabel sibling component */}
								<MenuItem value="" disabled>Select Meal</MenuItem>
								<MenuItem value="Lunch">Lunch</MenuItem>
								<MenuItem value="Dinner">Dinner</MenuItem>
							</Select>
							<TimePicker
								id="hour"
								name="hour"
								value={hour}
								onChange={(newValue) => {
									setHour(newValue);
								}}
								views={["hours", "minutes"]}
								disabled={!meal || !minBookTime || !maxBookTime} // Disable if meal/times not set
								sx={{width: "100%"}}
								disablePast={isDateToday} // Only disable past if date is today
								skipDisabled
								minTime={minBookTime} // Use state variable
								maxTime={maxBookTime} // Use state variable
								timeSteps={
									{
										hours: 1,
										minutes: 30,
									}
								}
								ampm={false} // Use 24hr format
								// timeSteps prop might not be needed if min/max/step cover it
							/>
						</div> 
					 
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="restaurant">Restaurant</FormLabel>
					<Select
						labelId="restaurant"
						id="restaurant"
						value= {restaurant}
						label="Restaurant"
						onChange={handleRestaurantChange}
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
						InputProps={{ // Correct prop for input attributes
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
						value= {booking_state}
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
				<Box
					sx={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 1, gridColumn: '1 / -1' }} // Span across columns and add gap
				>
					<Button onClick={props.onClose} variant="outlined" disabled={isWaiting}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={isWaiting || !hour}> {/* Disable submit if waiting or hour not selected */}
						{isWaiting ? 'Adding...' : 'Add Booking'}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

AddBookingForm.propTypes = {
	onClose: PropTypes.func.isRequired,
};

export default AddBookingForm;
