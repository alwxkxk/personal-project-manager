import { ADD_PROJECT ,GET_ALL_PROJECTS} from "../actionTypes";


const initState:IProject[]= []




export default function(state:any=initState, action:any) {
  // console.log("project function",state,action)
  switch (action.type) {
    case ADD_PROJECT:
      const arr = state.slice();
      arr.push(action.payload);
      return arr;
    case GET_ALL_PROJECTS:
      return action.payload.slice()
    default:
      return state;
  }
}