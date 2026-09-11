import express from 'express';
import morgan from 'morgan';
import routesUser from './routes/routesUser.js';



const server = express();
server.use(morgan('dev'));
server.use(express.json());
server.use('/user', routesUser);
server.get('/',(req,res)=>{
    res.status(404).send("Not found");
});

export default server;