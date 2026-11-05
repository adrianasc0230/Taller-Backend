import jwt from 'jsonwebtoken';
import { token } from 'morgan';



export function generarToken(payload){
    return new Promise((resolver, rechazar)=>{
        jwt.sign(payload, 'clave secreta', {expiresIn: '1h'},
            (error, token)=>{
                if(error){
                    rechazar(error);
                }else {
                    resolver(token);
                }
            }
        );
    });
}

export function validarToken(token){
    return new Promise((resolver, rechazar)=>{
        if (!token) return rechazar(new Error('Token no proporcionado'));
        jwt.verify(token, 'clave secreta', (error, decodificado)=>{
            if(error){
                rechazar(error);
            }else{
                resolver(decodificado);
            }
        });
    });
}