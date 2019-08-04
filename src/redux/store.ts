import { createStore ,applyMiddleware,compose} from "redux";
import rootReducer from "./reducers";
import thunk from 'redux-thunk';

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);