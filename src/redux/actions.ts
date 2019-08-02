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
  DELETE_PROJECT,
  RESTORE_TASK,
  RESTORE_PROJECT,
  SET_GLOBAL_USER,
  GET_GLOBAL_USER
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


export function setProjectAction(project:IProject,actionTypes?:string) {
  const projects = store.getState().projects.slice();
  const oldProject = projects.find((p:IProject)=> p.uuid === project.uuid);
  if(oldProject){
    Object.assign(
      oldProject,
      project,
      {updateTime:moment().format()}
      )
  }
  db.saveProject(project);
  return {
    type:actionTypes || SET_PROJECT,
    payload:projects
  }
}

export function deleteProjectAction(project:IProject) {

  return setProjectAction({
    ...project,
    delete:true
  },DELETE_PROJECT)
}

export function restoreProjectAction(project:IProject){
  return setProjectAction({
    ...project,
    delete:false
  },RESTORE_PROJECT)
}


export const addTaskAction=(taskInfo:any)=>{
  const task = newTask(taskInfo);
  db.saveTask(task)
  return({
    type:ADD_TASK,
    payload:task
  })
}

export function setGlobalUser(user:any) {
  const userInfo = {
    githubId:user.id,
    name:user.name,
    avatar_url:user.avatar_url
  }
  db.updateUser(userInfo)
  return ({
    type:SET_GLOBAL_USER,
    payload:userInfo
  })
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

export function setTask(task:ITask,actionTypes?:string) {
  const tasks = store.getState().tasks.slice();
  const oldTask = tasks.find((t:ITask)=> t.uuid === task.uuid)
  if(oldTask){
    Object.assign(
      oldTask,
      task,
      {updateTime:moment().format()}
    )
    db.updateTask(oldTask);
  }

  return {
    type:actionTypes || SET_TASK,
    payload:tasks
  }
}

export function deleteTaskAction(task:ITask) {
  return setTask({
    ...task,
    delete:true
  },DELETE_TASK)
}

export function restoreTaskAction(task:ITask) {
  return setTask({
    ...task,
    delete:false
  },RESTORE_TASK)
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
      db.getSetups(),
      db.getUser()
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
      dispatch({
        type:GET_GLOBAL_USER,
        payload:values[3][0]
      })

      //set the last active project as global
      const lastProject = values[0].filter((p:IProject)=> !p.delete).sort( (a:IProject,b:IProject)=>{
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
