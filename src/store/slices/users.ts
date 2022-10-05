import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

export interface UserType {
    id: number;
    email: string;
    password: string;
    name: string;
    logged_in: boolean;
}

export interface UserState {
    users: UserType[];
    user: UserType | null;
    loginFlag: boolean;
}

const initialState : UserState = {
    users: [],
    user: null,
    loginFlag: false,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await axios.get<UserType[]>("/api/user");
    return response.data;
});

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
      const response = await axios.get<UserType>(`/api/user/1`);
      return response.data ?? null;
    }
);

export const inUser = createAsyncThunk(
  "users/inUser",
  async (user: UserType, { dispatch }) => {
    const response = await axios.put('/api/user/' + user.id, user);
    dispatch(userActions.logIn(response.data));
  }
);

export const outUser = createAsyncThunk(
    "users/outUser",
    async (user: UserType, {dispatch}) => {
        const response = await axios.put('/api/user/' + user.id, user);
        dispatch(userActions.logOut(response.data));
    }
);

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers:{
        logIn: (state, action: PayloadAction<UserType>) => {
            const newUser = {...action.payload, logged_in: true};
            const usersAfterLogin = state.users.filter((user) => {
                return (user.id !== action.payload.id);
            });
            return {...state, users: [...usersAfterLogin, newUser], user: newUser, loginFlag: true};
        },
        logOut: (state, action: PayloadAction<UserType>) => {
            const outUser = {...action.payload, logged_in: false};
            const usersAfterLogout = state.users.filter((user) => {
                return (user.id !== action.payload.id);
            });
            return {...state, users: [...usersAfterLogout, outUser], user: outUser, loginFlag: false};
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
        // Add user to the state array
            state.users = action.payload;
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    }
});

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;

export default userSlice.reducer;