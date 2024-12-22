import axios from 'axios';

// Action types
export const CANCEL_REQUEST_SUCCESS = 'CANCEL_REQUEST_SUCCESS';
export const CANCEL_REQUEST_FAILURE = 'CANCEL_REQUEST_FAILURE';
export const FETCH_FRIENDS_SUCCESS = 'FETCH_FRIENDS_SUCCESS';
export const FETCH_FRIENDS_FAILURE = 'FETCH_FRIENDS_FAILURE';

// Action creators
export const cancelRequest = (senderId, recipientId) => async (dispatch) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/request/${recipientId}/${senderId}`);
    dispatch({ type: CANCEL_REQUEST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CANCEL_REQUEST_FAILURE, error: error.message });
  }
};

export const fetchFriends = (rhid) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/auth/friends/${rhid}`);
    dispatch({ type: FETCH_FRIENDS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_FRIENDS_FAILURE, error: error.message });
  }
};
