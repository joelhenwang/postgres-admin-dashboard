import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const getTokenFromLocalStorage = () => {
    try{
        return localStorage.getItem('token');
    } catch (error) {
        console.error("Could not get token from local storage", error);
        return null;
    }
};

const initialState = {
    token: getTokenFromLocalStorage(),
    isLoading: false,
    isAuthenticated: !!getTokenFromLocalStorage(),
    user: null,
    error: null
};


// createAsyncThunk handles async actions and dispatches the lifecycle actions (pending, fulfilled, rejected)
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/signin/', { username, password });
            const token = response.data.accessToken;
            const user = response.data.user; // Assuming the API returns user data

            // Save token to localStorage
            try {
                localStorage.setItem('token', token);
            } catch (e) {
                console.error("Could not save token to local storage", e);
            }

            return { token, user }; // Return both token and user
        } catch (error) {
            let errorMessage = 'Failed to login';

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Could not connect to the server';
            } else {
                errorMessage = error.message;
            }

            console.error("Error logging in", error);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logoutUser: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.isLoading = false;
            try{
                localStorage.removeItem('token');
            } catch(e){
                console.error("Could not remove token from local storage", e);
            }
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                
                state.isLoading = false;
            });
    }
});
        

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;