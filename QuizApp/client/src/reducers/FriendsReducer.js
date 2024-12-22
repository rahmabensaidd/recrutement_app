import {
    CANCEL_REQUEST_SUCCESS,
    CANCEL_REQUEST_FAILURE,
    FETCH_FRIENDS_SUCCESS,
    FETCH_FRIENDS_FAILURE,
  } from '../actions/FriendsActions'; // Ajustez le chemin selon votre structure de dossiers
  
  const initialState = {
    friends: [],
    error: null,
    cancelRequestSuccess: false,
  };
  
  const friendReducer = (state = initialState, action) => {
    switch (action.type) {
      case CANCEL_REQUEST_SUCCESS:
        return {
          ...state,
          cancelRequestSuccess: true,
        };
      case CANCEL_REQUEST_FAILURE:
        return {
          ...state,
          error: action.error,
        };
      case FETCH_FRIENDS_SUCCESS:
        return {
          ...state,
          friends: action.payload,
        };
      case FETCH_FRIENDS_FAILURE:
        return {
          ...state,
          error: action.error,
        };
      default:
        return state;
    }
  };
  
  export default friendReducer;
  