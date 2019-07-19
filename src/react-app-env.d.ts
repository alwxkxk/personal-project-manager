/// <reference types="react-scripts" />

interface IItem{
  createTime:string,
  desc:string,
  updateTime:string,
  uuid:string,
  title:string,
  type:string,
}

interface IProject extends IItem{
  deadline:string | null
}
