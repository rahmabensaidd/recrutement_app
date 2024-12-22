import {
    FETCH_SUGGESTIONS_REQUEST ,
     FETCH_SUGGESTIONS_SUCCESS ,
     FETCH_SUGGESTIONS_FAILURE ,
  } from '../actions/suggActions'; 
const initialState = {
    suggestions: [],
    loading: false,
    error: null,
  };
  
  export const suggestionsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SUGGESTIONS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_SUGGESTIONS_SUCCESS:
        return {
          ...state,
          loading: false,
          suggestions: action.payload,
        };
      case FETCH_SUGGESTIONS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  export default  suggestionsReducer;