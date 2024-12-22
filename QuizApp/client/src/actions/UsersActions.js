
import axios from 'axios';

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const fetchUsers = (rhId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/auth/users/exclude/${rhId}`);
    dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};

/*

export const sendRequest = (senderId, recipientId) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/api/request/send', {
      senderId,
      recipientId,
    });
    dispatch({ type: SEND_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SEND_REQUEST_FAILURE, error: error.message });
  }
};

export const cancelRequest = (senderId, recipientId) => async (dispatch) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/request/${senderId}/${recipientId}`);
    dispatch({ type: CANCEL_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CANCEL_REQUEST_FAILURE, error: error.message });
  }
};

export const updateRequestStatus = (senderId, recipientId, status) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/request/${senderId}/${recipientId}`, {
      status: status,
    });
    dispatch({ type: UPDATE_REQUEST_STATUS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_REQUEST_STATUS_FAILURE, error: error.message });
  }
};
export const getRequestStatus = (senderId, recipientId, status) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/request/${senderId}/${recipientId}`, {
      status: status,
    });
    dispatch({ type: GET_REQUEST_STATUS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_REQUEST_STATUS_FAILURE, error: error.message });
  }
};
*/