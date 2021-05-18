import * as actionTypes from './actionTypes';
import axios from '../../hoc/axios-instance';

export const setPaymentCount = (payCount) => {
    return {
        type: actionTypes.SET_PAYMENT_NOTIFICATION,
        payCount: payCount
    };
};

export const setPaymentError = () => {
    return {
        type: actionTypes.SET_PAYMENT_ERROR
    };
}

export const addPaymentCount = () => {
    return {
        type: actionTypes.PAYMENT_NOTIFICATION
    };
};

export const removePaymentCount = () => {
    return {
        type: actionTypes.REMOVE_PAYMENT_NOTIFICATION
    }
}

export const addPayment = () => {
    return dispatch => {
        dispatch(addPaymentCount());
    }
}

export const removePayment = () => {
    return dispatch => {
        dispatch(removePaymentCount());
    }
}

export const initPaymentCount = () => {
    return dispatch => {
        axios.get('OrderTask/getOrderCount/' + localStorage.getItem('customerId'))
            .then(response => {
                dispatch(setPaymentCount(response.data.response[0].orderCount));
            })
            .catch(error => {
                dispatch(setPaymentError());
            });
    };
};