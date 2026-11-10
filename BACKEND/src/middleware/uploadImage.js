import multer from "multer";
import path from 'path';
import fs from 'fs';

/* const storage = multer.diskStorage({
    destination: 'images',

    filename:(req,file,cb)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, extension).replace(/\s+/g,'-').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const uniqueName = `${nameWithoutExt}${timestamp}${extension}`;

        cb(null,uniqueName); 
    },
}); */

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'));
    }
};
const storageUsers = multer.diskStorage({
    destination: (req, file, cb)=>{
        const directory = 'images/users';
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory, {recursive:true});
        }
        cb(null, directory);
    },
    filename:(req, file, cb)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt= path.basename(file.originalname, extension).replace(/\s+/g, '-').toLocaleLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g,'');
        const uniqueName =`user-${nameWithoutExt}${timestamp}${extension}`;
        cb (null, uniqueName);
    },
});

export const uploadSingleImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },   // máximo 5 MB
    fileFilter,
}).single('images');
export const uploadUserImage = multer({storage: storageUsers}).single('images');