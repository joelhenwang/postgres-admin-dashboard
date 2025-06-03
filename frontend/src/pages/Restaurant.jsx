import * as React from "react";
import { Box, Typography, Button, Container, Paper, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookingsDataSlice";
import Table from "../components/Table";


const Restaurant = () => {
    const dispatch = useDispatch();
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
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
    
    
    
    
    
    
    
}