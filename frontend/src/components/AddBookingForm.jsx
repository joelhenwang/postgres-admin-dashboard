import { useState } from "react";
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
} from "@mui/material";
import { TimePicker} from "@mui/x-date"
import PropTypes from "prop-types";
import axiosInstance from '../utils/axiosConfig';
import { useDispatch } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";

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
	const [hour, setHour] = useState("");
	const [date, setDate] = useState("");
	const [guests, setGuests] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [table, setTable] = useState("");
	const [booking_note, setBookingNote] = useState("");
	const [booking_state, setBookingState] = useState("");
	const [isWaiting, setIsWaiting] = useState(false);
	const dispatch = useDispatch();

	// Handle restaurant selection
	const handleRestaurantChange = (event) => {
		setRestaurant(event.target.value);
	}
	
	// Handle submission
	async function handleSubmit(event) {
		event.preventDefault();
		setIsWaiting(true);
		
		const user = JSON.parse(sessionStorage.getItem("user"));
		const username = user.username;
		
		const bookingData = {
			restaurant: restaurant,
			date: date,
			hour: hour,
			guests: parseInt(guests),
			name: name,
			email: email,
			phone: phone,
			table: table,
			booking_state: booking_state,
			booking_note: booking_note,
			created_by: username,
		};
		
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
					<FormLabel htmlFor="date">Date</FormLabel>
					<TextField
						id="date"
						name="date"
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
						variant="outlined"
						slotProps={{
							inputLabel:{
								shrink: true,
							}
						}}
					/>
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="hour">Hour</FormLabel>
					
					<TextField
						id="hour"
						name="hour"
						type="hour"
						value={hour}
						onChange={(e) => setHour(e.target.value)}
						required
						variant="outlined"
						slotProps={{
							inputLabel:{
								shrink: true,
							}
						}}
					/>
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
						htmlInput={{ min: 1 }}
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

				<Box></Box>
				<Box
					sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
				>
					<Button onClick={props.onClose}>Cancel</Button>
					<Button type="submit">Add</Button>
				</Box>
			</Box>
		</Modal>
	);
};

AddBookingForm.propTypes = {
	onClose: PropTypes.func.isRequired,
};

export default AddBookingForm;
