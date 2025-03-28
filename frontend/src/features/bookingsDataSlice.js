import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// initial state
const initialState = {
  bookings: [],
  isLoadingBookings: false,
  lastFetch: null,
  error: null
};

// fetch bookings thunk
export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, thunkAPI) => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/bookings', {
                headers: {
                    'x-access-token': token
                }
            });
            return response.data;
        } catch (error) {
            let errorMessage = 'Error fetching bookings';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// bookings slice
const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBookingsData: (state) =>{
            state.bookings = [];
            state.isLoadingBookings = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.isLoadingBookings = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.isLoadingBookings = false;
                state.lastFetch = Date.now();
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.isLoadingBookings = false;
                state.error = action.payload;
            });
    } 
});

export const { clearBookingsData } = bookingsSlice.actions;
export default bookingsSlice.reducer;