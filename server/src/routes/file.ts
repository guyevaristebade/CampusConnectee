/*import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from "path";

const upload = multer({ storage: storage })
export const FileRouter : Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log(file)
        console.log( path.extname(file.fieldname))
        cb(null,file.originalname)
    }
})


// Route pour télécharger un fichier
FileRouter.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    res.send(req.file)
});
*/
