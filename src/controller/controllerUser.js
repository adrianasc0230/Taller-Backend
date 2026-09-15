import modelUsuer from "../models/modelUsuer.js";
import bcrypt from "bcryptjs";

const controllerUsers = {
    createUser: async (req , res)=>{
        try {
            const{name, email, rol, password, idCard} = req.body;
            const passwordProtected = await bcrypt.hash(password, 12);
            const newUser = new modelUsuer({
                name, 
                email, 
                rol: rol || "user",
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
    },

    deleteUser: async(req, res)=>{
        try {
            const deleteUser = await modelUsuer.findByIdAndDelete(req.params.id);
            if(deleteUser._id){
                res.json({
                    message: `El usuario con el ID:${deleteUser._id} ha sido borrado`,
                    data: null,

                });
            }
        } catch (error) {
            res.json({
                message:`Ocurrió un error eliminando el usuario con el ID:${req.params.id}`,
                data: error,
            });

            
        }
    },

    updateUser : async (req, res)=>{
        try {
            const updateData = { ...req.body};
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 12);
            }

            const userToUpdate = await modelUsuer.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new: true}
            );

            if(userToUpdate._id){
                res.json({
                    message: 'Usuaario actualizado exitosamente',
                    data: userToUpdate,
                });
            }
        } catch (error) {
            res.json({
                message: 'A ocurrido un error al actualizar el usuario',
                data: error,
            });
        }
    }
}

export default controllerUsers;