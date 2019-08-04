import Parse from "parse";
import moment from "moment";

const Task = Parse.Object.extend("Task");
const Project = Parse.Object.extend("Project");



if(process.env.REACT_APP_PARSE_APP_ID && process.env.REACT_APP_PARSE_SERVER_URL){
  Parse.initialize(process.env.REACT_APP_PARSE_APP_ID);
  Parse.serverURL=process.env.REACT_APP_PARSE_SERVER_URL;
  //@ts-ignore
  window.Parse = Parse;
  console.log("init parse JS SDK.")
}
else{
  console.log("no parse.")
}



function parseAvailable() {
  const flag = !!(process.env.REACT_APP_PARSE_APP_ID && process.env.REACT_APP_PARSE_SERVER_URL)
  if(!flag){
    console.warn("parse is unavailable.")
  }
  return flag;
}

export function userAvailable() {
  const user = Parse.User.current();
  return user;
}

export function getGithubToken(code:string):Promise<any> {
  if(parseAvailable()){
    return Parse.Cloud.run("github-oauth", {code:code})
    .then((res:any)=>{
      //{"status":200,"text":"access_token=TOKEN12345678&scope=&token_type=bearer"}
      //{"status":200,"text":"error=bad_verification_code&error_description=..."}}
      if( !res.text.includes("error") ){
        const token = res.text.split("&")[0].split("=")[1]
        return Promise.resolve(token)
      }
      else{
        return Promise.reject(res)
      }
      
    })
    .catch((err:any)=>{
      handleParseError(err)
    })

  }
  return Promise.reject("parse is unavailable.")
}

export function loginByGithub(id:string,token:string) {
  const myAuthData = {
    "id": id,
    "access_token": token
  };
  //@ts-ignore
  return Parse.User.logInWith('github', { authData: myAuthData})
  .then((res:any)=>{
    console.log("loginByGithub success:",res)
  })
  .catch((err:any)=>console.log("loginByGithub fail:",err))
}

export function handleParseError(err:Parse.Error) {
  console.warn("handleParseError:",err)
  switch (err.code) {
    //@ts-ignore
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();

      break;
    default:
      console.log("Don't handle this error.")
      break;

  }
}

function cloneToParseObject(sourceObject:any,parseObject:Parse.Object) {
  Object.keys(sourceObject).forEach((key:string)=>{
    parseObject.set(key,sourceObject[key])
  })
}

function parseObjectToObject(parseObject:Parse.Object) {
  const obj = JSON.parse(JSON.stringify(parseObject))
  const result:any = {};
  Object.keys(obj)
  .forEach((key:string)=>{
    if(
      key !== "objectId" &&
      key !== "ACL" &&
      key !== "user" &&
      key !== "updatedAt" &&
      key !== "createdAt"
    ){
      result[key]=obj[key]
    }
  })
  return result;
}


export function saveTask(task:ITask):Promise<Parse.Object> {
  let taskObj = new Task(task);
  taskObj.set("user",Parse.User.current());// relate user
  return taskObj.save();
}


export function updateTask(task:ITask) {
  const taskQuery = new Parse.Query(Task);
  taskQuery.equalTo('user',Parse.User.current())
  taskQuery.equalTo('uuid',task.uuid)
  return taskQuery.find()
  .then((res)=>{
    const obj = res[0]
    if(obj){
      cloneToParseObject(task,obj)
      return obj.save()
    }
    else{
      // create new object if not exit.
      return saveTask(task);
    }
    
  })
}


export function getBackupTime():Promise<any> {
  const user = Parse.User.current();
  const userQuery = new Parse.Query(Parse.User);
  const taskQuery = new Parse.Query(Task);
  if(user){
    userQuery.equalTo("objectId",user.get("objectId"))
    return taskQuery.find()
    .then((res)=>{
      const obj:any = res[0];
      if(obj){
        return Promise.resolve(obj.backupTime)
      }
    })
  }
  else{
    return Promise.reject('parse user unavailable.')
  }
}

export function setBackupTime(time:string):Promise<any> {
  const user = Parse.User.current();
  if(user){
    user.set("backupTime",time);
    return user.save()
  }
  else{
    return Promise.reject('parse user unavailable.')
  }
}

export function fetchFromServer(backupTime:string):Promise<any> {
  const projectQuery = new Parse.Query(Project);
  const taskQuery = new Parse.Query(Task);
  const user = Parse.User.current();
  
  projectQuery.equalTo('user',user);
  taskQuery.equalTo('user',user);
  if(backupTime){
    projectQuery.greaterThan('updateTime',backupTime)
    taskQuery.greaterThan('updateTime',backupTime)
  }

  return Promise.all([projectQuery.find(),taskQuery.find()])
  .then((values:[Parse.Object[],Parse.Object[] ])=>{
    const projects:IProject[] =[]
    const tasks:ITask[]=[]
    values[0].forEach((p:Parse.Object)=>{
      projects.push(parseObjectToObject(p));
    })

    values[1].forEach((t:Parse.Object)=>{
      tasks.push(parseObjectToObject(t));
    })
    // console.log(projects,tasks)
    return Promise.resolve({projects:projects,tasks:tasks})
  })

}

//@ts-ignore
window.fetchFromServer=fetchFromServer


export function pushToServer(projects:IProject[],tasks:ITask[],newBackupTime?:string){
  return Parse.Cloud.run("batch-synchronize", {
    projects:projects,
    tasks:tasks,
    newBackupTime: newBackupTime || moment().format()
  })
}

//@ts-ignore
window.pushToServer=pushToServer




