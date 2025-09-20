import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, ApiResponse, PaginatedResponse } from '../../types';
import { messageAPI } from '../../api/message';

interface MessageState {
  messages: Message[];
  currentConversation: Message[];
  isLoading: boolean;
  error: string | undefined;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Async thunks
export const getMessages = createAsyncThunk(
  'messages/getMessages',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await messageAPI.getMessages(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const getConversation = createAsyncThunk(
  'messages/getConversation',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await messageAPI.getConversation(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (data: { receiverId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await messageAPI.sendMessage(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await messageAPI.markAsRead(messageId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await messageAPI.deleteMessage(messageId);
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

const initialState: MessageState = {
  messages: [],
  currentConversation: [],
  isLoading: false,
  error: undefined,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    clearConversation: (state) => {
      state.currentConversation = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.currentConversation.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.currentConversation.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.currentConversation[index] = action.payload;
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.currentConversation = state.currentConversation.filter(msg => msg.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = undefined;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Conversation
      .addCase(getConversation.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.error = undefined;
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentConversation.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const message = state.currentConversation.find(msg => msg.id === action.payload.id);
        if (message) {
          message.isRead = true;
        }
      })
      // Delete Message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.currentConversation = state.currentConversation.filter(msg => msg.id !== action.payload);
      });
  },
});

export const { clearError, clearConversation, addMessage, updateMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
