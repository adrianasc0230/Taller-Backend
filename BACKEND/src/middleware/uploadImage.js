import multer from "multer";
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: 'images',

    filename:(req,file,cb)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, extension).replace(/\s+/g,'-').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const uniqueName = `${nameWithoutExt}${timestamp}${extension}`;

        cb(null,uniqueName); 
    },
});
const storageUsers = multer.diskStorage({
    destination: (req, file, cb)=>{
        const directory = 'images/users';
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory, {recursive:true});
        }
        cb(null, directory);
    },
    filename:(req, file, cd)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt= path.basename(file.originalname, extension).replace(/\s+/g, '-').toLocaleLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g,'');
        const uniqueName =`user-${nameWithoutExt}${timestamp}${extension}`;
        cb(null, uniqueName);
    },
});

export const uploadSingleImage = multer({storage}).single('images');
export const uploadUserImage = multer({storage: storageUsers}).single('images');