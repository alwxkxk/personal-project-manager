import Dexie from 'dexie';

const db = new Dexie("PersonalProjectManager");
db.version(1).stores({
  projects: "&uuid,updateTime"
});


export function saveProject(project:IProject) {
  //@ts-ignore
  db.projects.add(project)
}

export function getAllProjects():Promise<any> {
  //@ts-ignore
  return db.projects.toArray();
}