import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import candidateReducer from './reducers/candidateReducer';
import suggestionsReducer from './reducers/suggestionReducer';
import friendReducer from './reducers/FriendsReducer';
import userReducer from './pages/slices/userSlice';
import usersReducer from './reducers/userReducer';
const rootReducer = combineReducers({
  candidates: candidateReducer,

    user: userReducer,
    suggestions: suggestionsReducer,
    friends:friendReducer,
    users: usersReducer, 
});

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);


export default store;
