import { useState, useEffect } from "react";
import {
	Modal,
	Button,
	Box,
	FormControl,
	FormLabel,
	TextField,
	Input,
	InputLabel,
} from "@mui/material";
import axios from "axios";
import { Add } from "@mui/icons-material";

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

const AddUserForm = () => {
	// States
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [isWaiting, setIsWaiting] = useState(false);

	// Handle submission
	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const response = await axios.post("http://localhost:3000/api/user/add");
		} catch (e) {
			console.error("Could not send request to add user", e);
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
						type="text"
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
						type="password"
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
					<Button>Cancel</Button>
					<Button>Add</Button>
				</Box>
			</Box>
		</>
	);
};

export default AddUserForm;
