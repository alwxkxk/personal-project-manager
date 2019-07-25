import { ADD_PROJECT ,GET_ALL_PROJECTS,SET_PROJECT,DELETE_PROJECT} from "../actionTypes";

const initState:IProject[]= []

export default function(state:IProject[]=initState, action:any) {
  // console.log("project function",state,action)
  switch (action.type) {
    case ADD_PROJECT:
      const arr = state.slice();
      arr.push(action.payload);
      return arr;
    case DELETE_PROJECT:
    case SET_PROJECT:
    case GET_ALL_PROJECTS:
      return action.payload.slice()
    default:
      return state;
  }
}