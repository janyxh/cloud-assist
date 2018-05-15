
// let base = "https://greenoffice.orvibo.com/intelligenceOffice";
// if (process.env.NODE_ENV === "development" || process.env.MODEL === "test") {
//   base = "http://192.168.2.189:8080/intelligenceOffice";
// }
// if (process.env.NODE_ENV == "test") {
//   base = "http://192.168.2.189:8080/intelligenceOffice";
// }
// else if(process.env.NODE_ENV == "development"){
//   base = "http://192.168.6.105:8080/intelligenceOffice";
// }

// console.log(process.env.NODE_ENV)

let base = "http://192.168.60.129:8080";
if (process.env.NODE_ENV === "development" || process.env.MODEL === "test") {
  base = "http://192.168.60.129:8080";
}
export default base;
