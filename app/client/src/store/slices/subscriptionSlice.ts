import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Subscription from "../../model/subscription";

interface SubscriptionState {
    subscription: Subscription[];
}

const initialState: SubscriptionState = {
    subscription: [],
};

export const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setSubscriptionState: (state, action: PayloadAction<Subscription[]>) => {
            state.subscription = action.payload;
        },
        clearSubscriptionState: () => initialState,
    },
});

export const {
    setSubscriptionState,
    clearSubscriptionState
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
export type { SubscriptionState };
