import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeProfile, EmployerProfile } from '../../types';
import { profileAPI } from '../../api/profile';

interface ProfileState {
  employeeProfile: EmployeeProfile | null;
  employerProfile: EmployerProfile | null;
  isLoading: boolean;
  error: string | undefined;
}

// Async thunks for employee profiles
export const getEmployeeProfile = createAsyncThunk(
  'profile/getEmployeeProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getEmployeeProfile(userId);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid employee profile response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch profile'
      );
    }
  }
);

export const createEmployeeProfile = createAsyncThunk(
  'profile/createEmployeeProfile',
  async (profileData: Partial<EmployeeProfile>, { rejectWithValue }) => {
    try {
      const response = await profileAPI.createEmployeeProfile(profileData);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid employee profile response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create profile'
      );
    }
  }
);

export const updateEmployeeProfile = createAsyncThunk(
  'profile/updateEmployeeProfile',
  async ({ id, data }: { id: string; data: Partial<EmployeeProfile> }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateEmployeeProfile(id, data);
      const payload = response.data.data;

      if (!payload) {
        throw new Error('Invalid employee profile response');
      }

      return payload;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadProfilePhoto',
  async ({ userId, file }: { userId: string; file: File }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.uploadProfilePhoto(userId, file);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid upload response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to upload photo'
      );
    }
  }
);

// Async thunks for employer profiles
export const getEmployerProfile = createAsyncThunk(
  'profile/getEmployerProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getEmployerProfile(userId);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid employer profile response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch profile'
      );
    }
  }
);

export const createEmployerProfile = createAsyncThunk(
  'profile/createEmployerProfile',
  async (profileData: Partial<EmployerProfile>, { rejectWithValue }) => {
    try {
      const response = await profileAPI.createEmployerProfile(profileData);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid employer profile response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create profile'
      );
    }
  }
);

export const updateEmployerProfile = createAsyncThunk(
  'profile/updateEmployerProfile',
  async ({ id, data }: { id: string; data: Partial<EmployerProfile> }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateEmployerProfile(id, data);
      const payload = response.data.data;

      if (!payload) {
        throw new Error('Invalid employer profile response');
      }

      return payload;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

export const uploadCompanyLogo = createAsyncThunk(
  'profile/uploadCompanyLogo',
  async ({ userId, file }: { userId: string; file: File }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.uploadCompanyLogo(userId, file);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid upload response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to upload logo'
      );
    }
  }
);

const initialState: ProfileState = {
  employeeProfile: null,
  employerProfile: null,
  isLoading: false,
  error: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    clearProfile: (state) => {
      state.employeeProfile = null;
      state.employerProfile = null;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Employee Profile
      .addCase(getEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeProfile = action.payload;
        state.error = undefined;
      })
      .addCase(getEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeProfile = action.payload;
        state.error = undefined;
      })
      .addCase(createEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeProfile = action.payload;
        state.error = undefined;
      })
      .addCase(updateEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        if (state.employeeProfile) {
          state.employeeProfile.profilePhotoUrl = action.payload.profilePhotoUrl;
        }
      })
      // Employer Profile
      .addCase(getEmployerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getEmployerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employerProfile = action.payload;
        state.error = undefined;
      })
      .addCase(getEmployerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createEmployerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createEmployerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employerProfile = action.payload;
        state.error = undefined;
      })
      .addCase(createEmployerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmployerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employerProfile = action.payload;
        state.error = undefined;
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        if (state.employerProfile) {
          state.employerProfile.companyLogoUrl = action.payload.companyLogoUrl;
        }
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
