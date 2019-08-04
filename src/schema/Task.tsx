import {Item,itemType} from './Item';
import uuid from 'uuid/v1';
import moment from 'moment';

export enum taskType{
  prior,
  middle,
  last
}

const Task = {
  ...Item,
  projectId:'',
  type:itemType.Task,
  taskType:taskType.prior,
  workload:4
}

export function newTask(taskInfo:any):ITask {
  const task ={
    ...Task,
    ...taskInfo
  }
  task.uuid = uuid();
  task.createTime = moment().format();
  task.updateTime = task.createTime;
  if(!task.title || task.title.length <1){
    task.title = "未命名"
  }

  if(!task.desc || task.desc.length < 1){
    task.desc = "..."
  }

  return task;
}
