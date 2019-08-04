import Dexie from 'dexie';
import moment from 'moment';

const db:any = new Dexie("PersonalProjectManager");
db.version(1).stores({
  projects: "&uuid,updateTime",
  tasks:'&uuid,updateTime',
  setups:"&name",
  user:"&uuid"
});



export function saveProject(project:IProject) {
  db.projects.put(project)
}

export function deleteProject(project:IProject) {
  db.projects.where("uuid").equals(project.uuid).delete()
}

export function saveTask(task:ITask) {
  db.tasks.put(task)
}
// TODO :can be replace by saveTask
export function updateTask(task:ITask) {
  db.tasks.put(task)
}

export function deleteTask(task:ITask){
  db.tasks.where("uuid").equals(task.uuid).delete()
}

export function getAllProjects():Promise<IProject[]> {
  return db.projects.toArray();
}

export function getAllTasks():Promise<ITask[]> {
  return db.tasks.toArray();
}

export function updateSetups(setups:ISetups) {
  return db.setups.put({
    ...setups,
    name:'setups',
    updateTime:moment().format()
  })
}

export function updateUser(user:any) {
  return db.user.put({
    ...user,
    uuid:"1",// only one user
    updateTime:moment().format()
  })
}

export function getSetups():Promise<ISetups[]>{
  return db.setups.toArray();
}

export function getUser():Promise<any[]> {
  return db.user.toArray();
}