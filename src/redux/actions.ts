import {ADD_PROJECT,GET_ALL_PROJECTS} from './actionTypes';

import Project from './schema/Project';
// import Task from './schema/Task';
import {saveProject} from '../db';
import uuid from 'uuid/v1';
import moment from 'moment';
import {getAllProjects} from '../db'
import store from './store';

//@ts-ignore
store.dispatch(getAllProjectsAction())


export const addProject = (projectInfo:any) => {
  // console.log("addProject");
  // TODO: save in indexedDB
  const project = Object.assign({},Project,projectInfo);
  project.uuid = uuid();
  project.createTime = moment().format();
  project.updateTime = project.createTime;
  // console.log("addProject",project);
  saveProject(project);
  return ({
    type: ADD_PROJECT,
    payload: project
  });

}

function updateAllProjectsActionReturn(arr:IProject[]) {
  console.log("updateAllProjectsActionReturn",arr)
  return({
    type:GET_ALL_PROJECTS,
    payload:arr
  })
}

// async
export function getAllProjectsAction(){
  return (dispatch:any) => {
      return getAllProjects()
      .then( (arr)=>dispatch(updateAllProjectsActionReturn(arr)) )
      .catch((err:any)=>console.error(err))
  }
}


