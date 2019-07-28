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
  GET_GLOBAL_SETUPS,
  SET_PROJECT,
  DELETE_PROJECT
} from './actionTypes';

import {newProject} from '../schema/Project';
import {newTask} from '../schema/Task';
import * as db from '../db'
import store from './store';
import moment from 'moment';

// get all data from indexedDB then update page
//@ts-ignore
store.dispatch(init())

export const addProjectAction = (projectInfo:any) => {
  const projects = store.getState().projects
  const project = newProject(projectInfo);

  // first project set in global project
  if(projects.length === 0){
    store.dispatch({
      type:SET_GLOBAL_PROJECT,
      payload:project
    });
  }

  db.saveProject(project);
  return ({
    type: ADD_PROJECT,
    payload: project
  });
}


export function setProjectAction(project:IProject) {
  const projects = store.getState().projects.slice();
  project.updateTime = moment().format();
  projects.forEach((p:IProject)=>{
    if(p.uuid === project.uuid){
      Object.assign(p,project)
    }
  })
  db.saveProject(project);
  return {
    type:SET_PROJECT,
    payload:projects
  }
}

export function deleteProjectAction(project:IProject) {
  const global = store.getState().global
  const projects = store.getState().projects
  .filter((p:IProject)=>p.uuid !== project.uuid)
  .slice()
  db.deleteProject(project)
  
  // delete same project in global data
  if(global && global.project && global.project.uuid === project.uuid){
    store.dispatch({
      type:SET_GLOBAL_TASKS,
      payload:[]
    })
    store.dispatch({
      type:SET_GLOBAL_PROJECT,
      payload:{}
    })
  }

  return {
    type:DELETE_PROJECT,
    payload:projects
  }
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
  const global = store.getState().global
  const tasks = store.getState().tasks
    .filter((t:ITask)=>{
      return t.uuid !== task.uuid;
    })
    .slice();

  // delete same task in global data
  if(global.project && global.project.uuid === task.projectId){
    const ts = global.tasks.filter((t:ITask)=>{
      return t.uuid !== task.uuid;
    })
    .slice()
    store.dispatch({
      type:SET_GLOBAL_TASKS,
      payload:ts
    })
  }
    
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

export function setNavbarTitle(title:string) {
  return {
    type:SET_NAVBAR_TITLE,
    payload:title
  }
}

export function setTask(task:ITask) {
  const tasks = store.getState().tasks.slice();
  tasks.forEach( (t:ITask) => {
    if(t.uuid === task.uuid){
      Object.assign(t,task,{updateTime:moment().format()})
    }
    db.updateTask(t);
  });
  // note: it will update same task in global.tasks
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


function init() {
  return (dispatch:any)=>{


    return Promise.all([
      db.getAllProjects(),
      db.getAllTasks(),
      db.getSetups()
    ])
    .then((values:any[])=>{
      // console.log('init:',values)
      // get all data
      dispatch({
        type:GET_ALL_PROJECTS,
        payload:values[0]
      })
      dispatch({
        type:GET_ALL_TASKS,
        payload:values[1]
      })
      dispatch({
        type:GET_GLOBAL_SETUPS,
        payload:values[2][0]
      })

      //set the last project as global
      const lastProject = values[0].sort( (a:IProject,b:IProject)=>{
          // @ts-ignore
          return new Date(b.createTime) - new Date(a.createTime);
        })[0]
      if(lastProject){
        dispatch(setGlobalProject(lastProject));
        dispatch(setGlobalTasksByProjectId(lastProject.uuid));
      }

    })
    .catch((err:any)=>{
      console.log(err)
    })
  }
}
