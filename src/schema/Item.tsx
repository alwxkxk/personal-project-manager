export enum itemType{
  Item,
  Project,
  Task
}

export const Item:IItem = {
  createTime:'',
  completeTime:'',
  delete:false,
  desc:'',
  updateTime:'',
  uuid:'',
  title:'',
  type:itemType.Item,
  state:'',
  complete:false
  // visible:true
}

// export default {itemType,Item};