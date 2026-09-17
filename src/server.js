import express from 'express';
import morgan from 'morgan';
import routesUser from './routes/routesUser.js';
import routerProduct from './routes/routesProduct.js';
import routShopping from './routes/routesShopping.js';



const server = express();
server.use(morgan('dev'));
server.use(express.json());
server.use('/user', routesUser);
server.use('/product',routerProduct);
server.use('/shopping', routShopping);

server.get('/',(req,res)=>{
    res.status(404).send("Not found");
});

export default server;