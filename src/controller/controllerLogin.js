import modelUsuer from "../models/modelUsuer.js";
import {generarToken, validarToken} from "../ayudas/funciones.js";
import bcrypt from "bcryptjs";

const controllerLogin = {
    login: async(req, res)=>{
        try {
            const{username, password} = req.body;
            const userFound = await modelUsuer.findOne({
                email: username,
            });

            const passwordValidated = await bcrypt.compare(password, userFound.password);
            if(passwordValidated){
                const token = await generarToken({
                    id: userFound._id,
                    name: userFound.name
                });
                res.json({
                    message: `Acceso permitido Bienvenido ${userFound.name}`,
                    data: token,
                });
            }else{
                res.json({
                    message: 'Acceso denegado',
                    data: null,
                });
            }

        } catch (error) {
            console.log(error);
            res.json({
                message: 'ocurrio un error durante el inicio de sesion',
                data: error,
            });
        }
    },

    validateToken: async(req, res)=>{
        try {
            const token = req.params.token;
            const decodificado = await validarToken(token);

            if(decodificado && decodificado.id){
                res.json({
                    message: 'Token valido',
                    data: decodificado,
                });
            }else{
                res.json({
                    message: 'Token invalido',
                    data: null,
                });
            }
        } catch (error) {
            res.json({
                message: 'Ocurrio un error validando el token',
                data: error,
            });
        }
    }
};

export default controllerLogin;