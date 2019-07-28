import { 
  SET_NAVBAR_TITLE,
  SET_GLOBAL_PROJECT,
  SET_GLOBAL_TASKS,
  SET_GLOBAL_SETUPS,
  GET_GLOBAL_SETUPS,
} from "../actionTypes";

const initState:any= {
  navTitle:'首页',
  project:null,
  tasks:[],
  setups:{
    workTime:2
  }
}

export default function(state:any=initState, action:any) {
  // console.log("global action ",state,action)
  switch (action.type) {
    case SET_NAVBAR_TITLE:
      return {
        ...state,
        navTitle:action.payload
      };

    case SET_GLOBAL_PROJECT:
      return{
        ...state,
        project:action.payload
      }

    case SET_GLOBAL_TASKS:
      return{
        ...state,
        tasks:action.payload
      }

    case SET_GLOBAL_SETUPS:
        return {
          ...state,
          setups:action.payload
        }
    case GET_GLOBAL_SETUPS:
      let workTime = action.payload.workTime || 2
      return {
        ...state,
        setups:{
          ...action.payload,
          workTime:workTime
        }
      }

    default:
      return state;
  }
}