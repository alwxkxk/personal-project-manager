import {
  ADD_PROJECT,
  GET_ALL_PROJECTS,
  SET_NAVBAR_TITLE,
  ADD_TASK,
  GET_ALL_TASKS,
  SET_GLOBAL_PROJECT,
  SET_GLOBAL_TASKS,
  SET_TASK,
  DELETE_TASK,
  SET_GLOBAL_SETUPS,
  GET_GLOBAL_SETUPS
} from './actionTypes';

import {newProject} from '../schema/Project';
import {newTask} from '../schema/Task';
import * as db from '../db'
import store from './store';

// get all project data from indexedDB then update page
//@ts-ignore
store.dispatch(getAllProjectsAction())
//@ts-ignore
store.dispatch(getAllTasksAction())
//@ts-ignore
store.dispatch(getGlobalSetupsAction())


export const addProjectAction = (projectInfo:any) => {
  const project = newProject(projectInfo);
  db.saveProject(project);
  return ({
    type: ADD_PROJECT,
    payload: project
  });
}

export const addTaskAction=(taskInfo:any)=>{
  const task = newTask(taskInfo);
  db.saveTask(task)
  return({
    type:ADD_TASK,
    payload:task
  })
}

export function deleteTaskAction(task:ITask) {
  let tasks = store.getState().tasks
    .filter((t:ITask)=>{
      return t.uuid !== task.uuid
    })
    .slice();
    
  db.deleteTask(task);

  return {
    type:DELETE_TASK,
    payload:tasks
  }
}

export function setGlobalProject(project:IProject) {
  return {
    type:SET_GLOBAL_PROJECT,
    payload:project
  }
}

export function setGlobalTasksByProjectId(projectId:string) {
  const tasks:ITask[] = []
  store.getState().tasks.forEach( (t:ITask) => {
    if(t.projectId === projectId){
      tasks.push(t)
    }
  });
  // console.log("setGlobalTasksByProjectId",tasks)
  return {
    type:SET_GLOBAL_TASKS,
    payload:tasks
  }
}

// async get all projects
export function getAllProjectsAction(){
  return (dispatch:any) => {
      return db.getAllProjects()
      .then( (arr)=>dispatch({
        type:GET_ALL_PROJECTS,
        payload:arr
      }))
      .catch((err:any)=>console.error(err))
  }
}

export function getAllTasksAction() {
  return (dispatch:any) => {
    return db.getAllTasks()
    .then( (arr)=>dispatch({
      type:GET_ALL_TASKS,
      payload:arr
    }))
    .catch((err:any)=>console.error(err))
} 
}

export function setNavbarTitle(title:string) {
  return {
    type:SET_NAVBAR_TITLE,
    payload:title
  }
}

export function setTask(task:ITask) {
  let tasks = store.getState().tasks.slice();
  tasks.forEach( (t:ITask) => {
    if(t.uuid === task.uuid){
      Object.assign(t,task)
    }
    db.updateTask(t);
  });

  return {
    type:SET_TASK,
    payload:tasks
  }

}

export function setGlobalSetups(setups:ISetups) {
  db.updateSetups(setups)
  return {
    type:SET_GLOBAL_SETUPS,
    payload:setups
  }
}

export function getGlobalSetupsAction() {
  return (dispatch:any) => {
    return db.getSetups()
    .then( (arr)=>dispatch({
      type:GET_GLOBAL_SETUPS,
      payload:arr[0] || {}
    }))
    .catch((err:any)=>console.error(err))
}
}

