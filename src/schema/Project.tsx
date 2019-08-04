import {Item,itemType} from './Item';
import uuid from 'uuid/v1';
import moment from 'moment';

const Project:IProject = {
  ...Item,
  type:itemType.Project,
  deadline:null,
  startTime:null
}

export function newProject(projectInfo:any):IProject {
  const project = {
    ...Project,
    ...projectInfo
  }
  project.uuid = uuid();
  project.createTime = moment().format();
  project.updateTime = project.createTime;
  project.startTime = project.createTime;

  if(!project.title || project.title.length <1){
    project.title = "未命名"
  }

  if(!project.desc || project.desc.length < 1){
    project.desc = "..."
  }

  return project;
}
