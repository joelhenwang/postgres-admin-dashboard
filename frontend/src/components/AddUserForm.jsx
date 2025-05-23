import { useState, useEffect } from "react";
import {
	Button,
	Box,
	FormControl,
	FormLabel,
	TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import axiosInstance from '../utils/axiosConfig';
import { useDispatch } from "react-redux";
import { fetchUsers } from "../features/usersDataSlice";


const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	maxWidth: "720px",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	display: "grid",
	gap: 4,
	gridTemplateColumns: "repeat(2,1fr)",
	p: 4,
};

const AddUserForm = (props) => {
	// States
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [isWaiting, setIsWaiting] = useState(false);
	const dispatch = useDispatch();


	// Handle submission
	async function handleSubmit(event) {
		event.preventDefault();
		setIsWaiting(true);
		
		const userData = {
			username,
			password,
			role,
			email
		};
		
		try {
			const response = await axiosInstance.post("/users/add", userData);
			await dispatch(fetchUsers()).unwrap();
			props.onClose();
		} catch (e) {
			console.error("Could not send request to add user", e);
			alert("Could not send request to add user");
		} finally{
			setIsWaiting(false);
		}
	}

	return (
		<>
			<Box component="form" onSubmit={handleSubmit} sx={style}>
				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="username">Username</FormLabel>
					<TextField
						id="username"
						name="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						variant="outlined"
					/>
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="password">Password</FormLabel>
					<TextField
						id="password"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						variant="outlined"
					/>
				</FormControl>

				<FormControl disabled={isWaiting}>
					<FormLabel htmlFor="role">Role</FormLabel>
					<TextField
						id="role"
						name="role"
						type="text"
						value={role}
						onChange={(e) => setRole(e.target.value)}
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
				<Box></Box>
				<Box
					sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
				>
					<Button onClick={props.onClose}>Cancel</Button>
					<Button type="submit">Add</Button>
				</Box>
			</Box>
		</>
	);
};

AddUserForm.propTypes = {
	onClose: PropTypes.func.isRequired,
 };

export default AddUserForm;
