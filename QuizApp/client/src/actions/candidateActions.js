import axios from 'axios';

export const FETCH_CANDIDATES_REQUEST = 'FETCH_CANDIDATES_REQUEST';
export const FETCH_CANDIDATES_SUCCESS = 'FETCH_CANDIDATES_SUCCESS';
export const FETCH_CANDIDATES_FAILURE = 'FETCH_CANDIDATES_FAILURE';

export const ASSIGN_QUIZ_SUCCESS = 'ASSIGN_QUIZ_SUCCESS';
export const ASSIGN_QUIZ_FAILURE = 'ASSIGN_QUIZ_FAILURE';

export const SEND_REQUEST_SUCCESS = 'SEND_REQUEST_SUCCESS';
export const SEND_REQUEST_FAILURE = 'SEND_REQUEST_FAILURE';

export const CANCEL_REQUEST_SUCCESS = 'CANCEL_REQUEST_SUCCESS';
export const CANCEL_REQUEST_FAILURE = 'CANCEL_REQUEST_FAILURE';

export const UPDATE_REQUEST_STATUS_SUCCESS = 'UPDATE_REQUEST_STATUS_SUCCESS';
export const UPDATE_REQUEST_STATUS_FAILURE = 'UPDATE_REQUEST_STATUS_FAILURE';
export const GET_REQUEST_STATUS_SUCCESS = 'GET_REQUEST_STATUS_SUCCESS';
export const GET_REQUEST_STATUS_FAILURE = 'GET_REQUEST_STATUS_FAILURE';
export const FETCH_SUGGESTIONS_REQUEST = 'FETCH_SUGGESTIONS_REQUEST';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';
export const fetchCandidates = () => async (dispatch) => {
  dispatch({ type: FETCH_CANDIDATES_REQUEST });
  try {
    const response = await axios.get('http://localhost:5000/api/auth/all');
    dispatch({ type: FETCH_CANDIDATES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_CANDIDATES_FAILURE, payload: error.message });
  }
};

export const fetchSuggestions = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_SUGGESTIONS_REQUEST });
  try {
    const response = await axios.get(`http://localhost:5000/api/sugg/${userId}`);
    dispatch({ type: FETCH_SUGGESTIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_SUGGESTIONS_FAILURE, payload: error.message });
  }
};

export const assignQuiz = (Qid, canId, rhId, achievement) => async (dispatch) => {
  try {
    const sentAt = new Date(); // Récupère la date actuelle

    const response = await axios.post('http://localhost:5000/api/assignments/assign', {
      Qid,
      canId,
      rhId,
      sentAt,
      achievement, // Inclure achievement dans l'objet envoyé au backend
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch({
      type: ASSIGN_QUIZ_SUCCESS,
      payload: {
        Qid,
        canId,
        rhId,
        sentAt,
        achievement, // Inclure achievement dans l'action ASSIGN_QUIZ_SUCCESS
      },
    });

    alert('Quiz assigned successfully!');
  } catch (error) {
    dispatch({ type: ASSIGN_QUIZ_FAILURE, error: error.message });
    console.error('Error assigning quiz:', error);
  }
};

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
