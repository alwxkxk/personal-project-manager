import Parse from "parse";

if(process.env.REACT_APP_PARSE_APP_ID && process.env.REACT_APP_PARSE_SERVER_URL){
  Parse.initialize(process.env.REACT_APP_PARSE_APP_ID);
  Parse.serverURL=process.env.REACT_APP_PARSE_SERVER_URL;
  //@ts-ignore
  window.Parse = Parse;
  console.log("init parse JS SDK.",Parse)
}
else{
  console.log("without parse.",Parse)
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

export function getGithubToken(code:string,dev?:boolean):Promise<any> {
  if(parseAvailable()){
    return Parse.Cloud.run(dev?"dev-github-oauth":"github-oauth", {code:code})
    .then((res:any)=>{
      //{"status":200,"text":"access_token=TOKEN12345678&scope=&token_type=bearer"}
      //{"status":200,"text":"error=bad_verification_code&error_description=..."}}
      // console.log("getGithubToken:",res)
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

// export function testSave() {
//   const TestClass = Parse.Object.extend("testClass");
//   const testObj = new TestClass({testKey:'testValue'});
//   testObj.save()
//   .then((res:any)=>console.log("save success:",res))
//   .catch((err:any)=>console.log("save fail:",err))
// }

// export function testAddUser(id:string,token:string){
//   const myAuthData = {
//       "id": id,
//       "access_token": token
//   };
//   const user = new Parse.User();
//   user._linkWith('github', { authData: myAuthData })
//   .then((res:any)=>console.log("save success:",res))
//   .catch((err:any)=>console.log("save fail:",err))
// }

// export function testAddUserByAnonymous(id:string) {
//   const myAuthData = {
//     "id": id
//   };
//   const user = new Parse.User();
//   user._linkWith('anonymous', { authData: myAuthData })
//   .then((res:any)=>console.log("save success:",res))
//   .catch((err:any)=>console.log("save fail:",err))
// }

// export function loginByAnonymous(id:string) {
//   const myAuthData = {
//     "id": id
//   };
//   //@ts-ignore
//   Parse.User.logInWith('anonymous', { authData: myAuthData})
//   .then((res:any)=>{
//     console.log("loginByAnonymous success:",res)
//     testCloudFunction()
//   })
//   .catch((err:any)=>console.log("loginByAnonymous fail:",err))
// }



// export function testCloudFunction() {
//   const params =  { movie: "The Matrix" };
//   return Parse.Cloud.run("averageStars", params)
//   .then((res:any)=>console.log("testCloudFunction success:",res))
//   .catch((err:any)=>{
//     handleParseError(err)
//   })
// }



