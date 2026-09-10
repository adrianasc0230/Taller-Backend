import server from "./server.js";
import "dotenv/config";
import "./conection.js";
server.listen(3000,()=>{
    console.log("Server connected to http://localhost:3000");
});
