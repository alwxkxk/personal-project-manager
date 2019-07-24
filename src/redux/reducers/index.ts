import { combineReducers } from "redux";
import projects from "./projects";
import global from "./global";
import tasks from "./tasks";
export default combineReducers({ projects,global,tasks });