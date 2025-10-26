import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JobPosting, JobApplication, SearchFilters } from '../../types';
import { jobAPI } from '../../api/job';

interface JobState {
  jobPostings: JobPosting[];
  myJobPostings: JobPosting[];
  applications: JobApplication[];
  currentJob: JobPosting | null;
  isLoading: boolean;
  error: string | undefined;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: SearchFilters;
}

// Async thunks
export const getJobPostings = createAsyncThunk(
  'jobs/getJobPostings',
  async (params: { page?: number; limit?: number; filters?: SearchFilters }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobPostings(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job postings');
    }
  }
);

export const getMyJobPostings = createAsyncThunk(
  'jobs/getMyJobPostings',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getMyJobPostings(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your job postings');
    }
  }
);

export const getJobPosting = createAsyncThunk(
  'jobs/getJobPosting',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobPosting(id);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid job posting response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch job posting'
      );
    }
  }
);

export const createJobPosting = createAsyncThunk(
  'jobs/createJobPosting',
  async (data: Partial<JobPosting>, { rejectWithValue }) => {
    try {
      const response = await jobAPI.createJobPosting(data);
      const payload = response.data.data;

      if (!payload) {
        throw new Error('Invalid job posting response');
      }

      return payload;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create job posting'
      );
    }
  }
);

export const updateJobPosting = createAsyncThunk(
  'jobs/updateJobPosting',
  async ({ id, data }: { id: string; data: Partial<JobPosting> }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.updateJobPosting(id, data);
      const payload = response.data.data;

      if (!payload) {
        throw new Error('Invalid job posting response');
      }

      return payload;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update job posting'
      );
    }
  }
);

export const deleteJobPosting = createAsyncThunk(
  'jobs/deleteJobPosting',
  async (id: string, { rejectWithValue }) => {
    try {
      await jobAPI.deleteJobPosting(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job posting');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async (data: { jobPostingId: string; coverLetter?: string }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.applyToJob(data);
      const payload = response.data.data;

      if (!payload) {
        throw new Error('Invalid job application response');
      }

      return payload;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to apply to job'
      );
    }
  }
);

export const getMyApplications = createAsyncThunk(
  'jobs/getMyApplications',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getMyApplications(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const getJobApplications = createAsyncThunk(
  'jobs/getJobApplications',
  async (jobPostingId: string, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobApplications(jobPostingId);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid job applications response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch job applications'
      );
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'jobs/updateApplicationStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await jobAPI.updateApplicationStatus(id, status);
      const data = response.data.data;

      if (!data) {
        throw new Error('Invalid job application response');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update application status'
      );
    }
  }
);

const initialState: JobState = {
  jobPostings: [],
  myJobPostings: [],
  applications: [],
  currentJob: null,
  isLoading: false,
  error: undefined,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Job Postings
      .addCase(getJobPostings.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getJobPostings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobPostings = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = undefined;
      })
      .addCase(getJobPostings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get My Job Postings
      .addCase(getMyJobPostings.fulfilled, (state, action) => {
        state.myJobPostings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      // Get Job Posting
      .addCase(getJobPosting.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      // Create Job Posting
      .addCase(createJobPosting.fulfilled, (state, action) => {
        state.myJobPostings.unshift(action.payload);
      })
      // Update Job Posting
      .addCase(updateJobPosting.fulfilled, (state, action) => {
        const index = state.myJobPostings.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.myJobPostings[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      // Delete Job Posting
      .addCase(deleteJobPosting.fulfilled, (state, action) => {
        state.myJobPostings = state.myJobPostings.filter(job => job.id !== action.payload);
      })
      // Apply to Job
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applications.unshift(action.payload);
      })
      // Get My Applications
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      // Get Job Applications
      .addCase(getJobApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
