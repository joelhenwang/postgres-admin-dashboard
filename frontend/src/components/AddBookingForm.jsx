import { useState } from "react";
import {
	Button,
	Box,
	FormControl,
	FormLabel,
	TextField,
	Modal,
} from "@mui/material";
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
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [guests, setGuests] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [isWaiting, setIsWaiting] = useState(false);
	const dispatch = useDispatch();

	// Handle submission
	async function handleSubmit(event) {
		event.preventDefault();
		setIsWaiting(true);
		
		const bookingData = {
			restaurant,
			date,
			time,
			guests: parseInt(guests),
			name,
			email,
			phone
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
					<TextField
						id="restaurant"
						name="restaurant"
						type="text"
						value={restaurant}
						onChange={(e) => setRestaurant(e.target.value)}
						required
						variant="outlined"
					/>
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
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="time">Time</FormLabel>
					<TextField
						id="time"
						name="time"
						type="time"
						value={time}
						onChange={(e) => setTime(e.target.value)}
						required
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="guests">Number of Guests</FormLabel>
					<TextField
						id="guests"
						name="guests"
						type="number"
						value={guests}
						onChange={(e) => setGuests(e.target.value)}
						required
						variant="outlined"
						inputProps={{ min: 1 }}
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
						required
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
						required
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
