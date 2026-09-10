import express from 'express';
import morgan from 'morgan';



const server = express();
server.use(morgan('dev'));
server.use(express.json());
server.get('/',(req,res)=>{
    res.status(404).send("Not found");
});

export default server;