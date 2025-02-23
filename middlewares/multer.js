import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()
const upload = (fieldName) => multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        //Lógica para definir los tipos de archivo permitidos según "req.uploadType"
        let filetypes

        if(req.uploadType === 'driverAuth'){
            filetypes = /jpeg|jpg|pdf/
        } else if (req.uploadType === 'driverProfile' || req.uploadType === 'passengerProfile'){
            filetypes = /jpeg|jpg/
        }

        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

        if(mimetype && extname){
            cb(null, true)
        } else {
            //cb(new Error(`Solo se permiten archivos ${filetypes}.`))
            //cb(new Error(`Solo se permiten archivos de tipo: ${filetypes.toString().replace(/\//g, '').replace(/\|/g, ', ')}.`));
            //req.fileValidationError = `Solo se permiten archivos de tipo: ${filetypes.toString().replace(/\//g, '').replace(/\|/g, ', ')}.`
            return cb(new Error(`Formato no permitido. Solo se aceptan archivos de tipo: ${allowedFormats}.`));
            cb(null, false) // No lanza un error crítico, pero invalida el archivo.
        }
    }
}).single(fieldName) //Asignación del campo dinámico. 

const setUploadType = (type) => {
    return (req, res, next) => {
        req.uploadType = type
        next()
    }
}

export{
    upload,
    setUploadType
}