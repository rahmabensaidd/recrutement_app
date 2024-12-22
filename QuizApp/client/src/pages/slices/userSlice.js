import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk('user/fetchUser', async (canId) => {
  const response = await axios.get(`http://localhost:5000/api/auth/user/${canId}`);
  return response.data;
});
export const fetchUserr = createAsyncThunk('user/fetchUser', async (canId) => {
  const response = await axios.get(`http://localhost:5000/api/auth/user/${canId}`);
  return response.data;
});
export const updateUserr = createAsyncThunk('user/updateUser', async ({ canId, userData }) => {
  const response = await axios.put(`http://localhost:5000/api/auth/userupdate/${canId}`, userData);
  return response.data;
});
// Async thunk to update user data
export const updateUser = createAsyncThunk('user/updateUser', async ({ rhId, userData }) => {
  const response = await axios.put(`http://localhost:5000/api/auth/userupdate/${rhId}`, userData);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {
      name: '',
      email: '',
      role: '',
      personalPhoto: '',
      placeOfResidence: { city: '', country: '' },
      recentJobPosts: [],
      training: [],
      mobileNumber: '',
      technologies: [],
      description: '',
      professionalTitle: '',
      softSkills: [],
      languages: [],
      hobbies: [],
      linkedinProfile: '',
      githubProfile: '',
      website: '',
      cvFile: ''
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    setUserField: (state, action) => {
      const { field, value } = action.payload;
      state.data[field] = value;
    },
    setNestedUserField: (state, action) => {
      const { field, subfield, value } = action.payload;
      state.data[field][subfield] = value;
    },
    setArrayUserField: (state, action) => {
      const { field, index, subfield, value } = action.payload;
      state.data[field][index][subfield] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { setUserField, setNestedUserField, setArrayUserField } = userSlice.actions;
export default userSlice.reducer;
