import type { Staff, User } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
}
const initialState : UserState = {
    user: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state : UserState, action: PayloadAction<User>) => {
            state.user = action.payload;
            if (state.user) state.isLoggedIn = true;
        },
        clearUser: (state : UserState) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;