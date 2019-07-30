/// <reference types="react-scripts" />

interface IItem{
  createTime:string,
  completeTime:string,
  delete:boolean,
  desc:string,
  updateTime:string,
  uuid:string, // uuid
  title:string,
  type:itemType,
  state:string,
  complete:boolean
}

interface IProject extends IItem{
  startTime:string | null,
  deadline:string | null
}

interface ITask extends IItem{
  taskType:taskType,
  projectId:string,
  workload:number // 1,2,4,8 hours
}

interface ISetups {
  name?:string, // for indexedDB key
  workTime:number,
  updateTime:string
}