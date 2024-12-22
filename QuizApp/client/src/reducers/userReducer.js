import {
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE
  } from '../actions/UsersActions';
  
  const initialState = {
    users: [],
    loading: true,
    error: null
  };
  
  const usersReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USERS_SUCCESS:
        return {
          ...state,
          users: action.payload,
          loading: false,
          error: null
        };
      case FETCH_USERS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default usersReducer;