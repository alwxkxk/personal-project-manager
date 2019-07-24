import Dexie from 'dexie';
import moment from 'moment';

const db:any = new Dexie("PersonalProjectManager");
db.version(1).stores({
  projects: "&uuid,updateTime",
  tasks:'&uuid,updateTime',
  setups:"&name"
});



export function saveProject(project:IProject) {
  db.projects.add(project)
}

export function saveTask(task:ITask) {
  db.tasks.add(task)
}

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

export function getSetups():Promise<ISetups[]>{
  return db.setups.toArray();
}