import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// initial state
const initialState = {
  users: [],
  isLoadingUsers: false,
  error: null
};

// fetch users thunk
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    'x-access-token': token
                }
            });
            return response.data;
        } catch (error) {
            let errorMessage = 'Error fetching users';
            if (error.response && error.response.data) {
                errorMessage = error.response.data.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// users slice
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsersData: (state) =>{
            state.users = [];
            state.isLoadingUsers = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoadingUsers = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isLoadingUsers = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoadingUsers = false;
                state.error = action.payload;
            });
    } 
});

export const { clearUsersData } = usersSlice.actions;
export default usersSlice.reducer;