import modelUsuer from "../models/modelUsuer.js";
import bcrypt from "bcryptjs";

const controllerUsers = {
    createUser: async (req , res)=>{
        try {
            const{name, email, rol, password, idCard} = req.body;
            const passwordProtected = await bcrypt.hash(password, 10);
            const newUser = new modelUsuer({
                name, 
                email, 
                rol, 
                idCard,
                password: passwordProtected, 
            });
            console.log(newUser);

            const createUser = await newUser.save();
            if(createUser._id){
                res.json({
                    message:'Usuario creado exitosamente!',
                    data: createUser,
                });
            }
        } catch (error) {
            res.json({
                message:'Ocurrio un error creando el usuario',
                data:error,
            });
        }
    },
    
    readUsers: async(req,res)=>{
        try {
            const UsersFound = await modelUsuer.find();
            res.json({
                message: 'Usuarios encontrado exitosamente',
                data: UsersFound,
            })
        } catch (error) {
            res.json({
                message:'Ocurrió un error al encontrar los usuarios',
                data: error,
            });
        }
    },

    readUserId: async(req, res)=>{
        try {
            const userFoundId = await modelUsuer.findById(
                req.params.id
            );
            if(userFoundId._id){
                res.json({
                    message: 'Usuario encontrado',
                    data: userFoundId,
                });
            }
        } catch (error) {
            res.json({
                message: 'Ha ocurrido un error al encontrar el usuario',
                data: error,
            });
        }
    }
}

export default controllerUsers;