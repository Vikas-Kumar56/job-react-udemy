import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { baseUrl } from '../../config';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk('users/register', async (user) => {
  const response = await axios.post(`${baseUrl}/api/v1/users`, user);
  return response.data.userId;
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}, // redux toolkit will create action for you
  extraReducers: {
    // you need to create your action
    [registerUser.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.user = { id: action.payload };
      state.error = null;
    },
    [registerUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export default userSlice.reducer;
