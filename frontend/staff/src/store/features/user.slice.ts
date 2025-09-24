import type { Staff, User } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: User | null;
    staff: Staff | null;
}
const initialState : UserState = {
    user: null,
    staff: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state : UserState, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setStaff: (state : UserState, action: PayloadAction<Staff>) => {
            state.staff = action.payload;
        },
        clearUser: (state : UserState) => {
            state.user = null;
            state.staff = null;
        },
    },
});

export const { setUser, setStaff, clearUser } = userSlice.actions;
export default userSlice.reducer;