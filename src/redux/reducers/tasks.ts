import { ADD_TASK,GET_ALL_TASKS,SET_TASK, DELETE_TASK, RESTORE_TASK} from "../actionTypes";

const initState:ITask[]= []

export default function(state:any=initState, action:any) {
  // console.log("project function",state,action)
  switch (action.type) {
    case ADD_TASK:
      const arr = state.slice();
      arr.push(action.payload);
      return arr;
    case DELETE_TASK:
    case RESTORE_TASK:
    case SET_TASK:
    case GET_ALL_TASKS:
      return action.payload.slice();
    default:
      return state;
  }
}