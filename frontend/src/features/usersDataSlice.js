import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';


// initial state
const initialState = {
  users: {},
  isLoadingUsers: false,
  error: null,
  usersLoaded: false
};

// fetch users thunk
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try{
            const response = await axiosInstance.get('/users');
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
                state.usersLoaded = false;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isLoadingUsers = false;
                state.error = null;
                state.usersLoaded = true
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoadingUsers = false;
                state.error = action.payload;
                state.usersLoaded = false
            });
    } 
});

export const { clearUsersData } = usersSlice.actions;
export default usersSlice.reducer;