import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    payCount: 0
};


const addPaymentCount = (state, action) => {
    const updatedCount = state.payCount + 1
    const updatedState = {
        payCount: updatedCount
    }
    return updateObject(state, updatedState);
}
const removePaymentCount = (state, action) => {
    const updatedCount = state.payCount - 1
    const updatedState = {
        payCount: updatedCount
    }
    return updateObject(state, updatedState);
}
const initPaymentCount = (state, action) => {
    const updatedCount = action.payCount
    const updatedState = {
        payCount: updatedCount
    }
    return updateObject(state, updatedState);
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PAYMENT_NOTIFICATION: return addPaymentCount(state, action);
        case actionTypes.SET_PAYMENT_NOTIFICATION: return initPaymentCount(state, action);
        case actionTypes.REMOVE_PAYMENT_NOTIFICATION: return removePaymentCount(state,action);
        default: return state;
    }
};

export default reducer;