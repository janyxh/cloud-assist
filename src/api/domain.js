// http://192.168.60.129:8080
// let base = "http://192.168.15.159/api";
// let base = "http://192.168.13.202/api";
let base = "http://yfz.5173.com/api";
if (process.env.NODE_ENV === "development") {
  base = "http://yfz.5173.com/api";
} else if (process.env.MODEL === "test") {
  base = "http://yfz.5173.com/api";
}
export default base;
