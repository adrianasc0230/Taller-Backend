import modelUsuer from "../models/modelUsuer.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

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
                    message:`Usuario creado exitosamente con el rol de: ${createUser.rol}`,
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
                message: 'Usuarios encontrados exitosamente',
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
                    message: 'Usuario actualizado exitosamente',
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
};
function generarContrasenaAleatoria(){
    return crypto.randomBytes(6).toString('hex');
}
export const forgotPassword = async (req,res) => {
    try{
        const {email}=req.body;
        const user = await modelUsuer.findOne({email});
        if(!user){
            res.json({
                result: 'mistake',
                message: 'El correo ingresado no se encuentra en nuestra base de datos',
                data: null,
            });
        }
        const newPass = generarContrasenaAleatoria();
        const hashPassword = await bcrypt.hash(newPass, 12);
        user.password = hashPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_NODE,
                pass: process.env.PASS_NODE
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_NODE,
            to: email,
            subject: 'Recuperacion de contraseña',
            text: `Hola ${user.name},\n\ntu nueva contraseña temporal es: ${newPass}\n\nRecuerda actualizar tu contraseña en tu perfil por seguridad.\n\nsaludos desde el area de soporte de Agroanima`
        };
        await transporter.sendMail(mailOptions);

        res.json({
            result:'fine',
            message: 'se ha enviado una nueva contraseña al correo registrado'
        });

    }catch(error){
        console.error('Error al recuperar la contraseña', error);
        res.json({
                result: 'mistake',
                message: 'Error interno en el servidor', error: error.message,
            });
    }
}


export default controllerUsers;