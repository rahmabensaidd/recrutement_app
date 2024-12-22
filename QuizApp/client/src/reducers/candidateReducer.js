import {
  FETCH_CANDIDATES_REQUEST,
  FETCH_CANDIDATES_SUCCESS,
  FETCH_CANDIDATES_FAILURE,
  ASSIGN_QUIZ_SUCCESS,
  ASSIGN_QUIZ_FAILURE,
  SEND_REQUEST_SUCCESS,
  SEND_REQUEST_FAILURE,
  CANCEL_REQUEST_SUCCESS,
  CANCEL_REQUEST_FAILURE,
  UPDATE_REQUEST_STATUS_SUCCESS,
  UPDATE_REQUEST_STATUS_FAILURE,
  GET_REQUEST_STATUS_SUCCESS,
  GET_REQUEST_STATUS_FAILURE,
} from '../actions/candidateActions'; // Assurez-vous d'importer correctement vos actionTypes

const initialState = {
  loading: false,
  candidates: [],
  error: '',
};

const candidateReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANDIDATES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CANDIDATES_SUCCESS:
      return {
        loading: false,
        candidates: action.payload,
        error: '',
      };
    case FETCH_CANDIDATES_FAILURE:
      return {
        loading: false,
        candidates: [],
        error: action.payload,
      };
    case ASSIGN_QUIZ_SUCCESS:
      return {
        ...state,
        assignedQuiz: action.payload,
      };
    case ASSIGN_QUIZ_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SEND_REQUEST_SUCCESS:
      return {
        ...state,
        requestStatus: action.payload,
      };
    case SEND_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case CANCEL_REQUEST_SUCCESS:
      return {
        ...state,
        requestStatus: action.payload,
      };
    case CANCEL_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        requestStatus: action.payload,
      };
    case UPDATE_REQUEST_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        requestStatus: action.payload,
      };
    case GET_REQUEST_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default candidateReducer;
