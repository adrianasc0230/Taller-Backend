import "dotenv/config";
import server from "./server.js";
import "./conection.js";

server.listen(3002, () => {
  console.log("Server connected to http://localhost:3002");
});