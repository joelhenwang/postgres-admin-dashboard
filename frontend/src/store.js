import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Import the reducer
import usersDataReducer from './features/usersDataSlice'; // Import the reducer
import bookingsDataReducer from './features/bookingsDataSlice'; // Import the reducer

export const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    data: usersDataReducer,
    bookings: bookingsDataReducer,
    // other reducers...
  },
  // Optional: Redux DevTools Extension is enabled by default in development mode
});

 
