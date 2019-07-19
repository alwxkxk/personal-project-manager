import Item from './Item';


const Project:IProject = Object.assign(
  Object.assign({},Item),
  {
    type:'Project',
    deadline:null
  }
)


export default Project;