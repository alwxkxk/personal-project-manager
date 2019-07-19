import Item from './Item';
const Task = Object.assign(
  Object.assign({},Item),
  {
    type:'Task'
  }
)

export default Task;