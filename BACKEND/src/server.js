import express from 'express';
import morgan from 'morgan';
import cors from  'cors';
import routesUser from './routes/routesUser.js';
import routerProduct from './routes/routesProduct.js';
import routShopping from './routes/routesShopping.js';
import routerLogin from './routes/routesLogin.js';



const server = express();
server.use(cors({origin:'http://localhost:4200'}));
server.use(morgan('dev'));
server.use(express.json());
server.use('/user', routesUser);
server.use('/products',routerProduct);
server.use('/shopping', routShopping);
server.use('/login', routerLogin);

server.get('/',(req,res)=>{
    res.status(404).send("Not found");
});

export default server;