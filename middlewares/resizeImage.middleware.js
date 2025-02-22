import fs from 'fs'
import path from 'path'
//import sharp from 'sharp/lib/sharp'
import sharp from 'sharp'
import cloudinary from '../config/cloudinary.js'

const resizeAndSave = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se cargó ninguna imagen." });
    }

    try {
        // Convierte el buffer de la imagen a un formato compatible con Cloudinary
        const fileExtension = path.extname(req.file.originalname);
        const id = req.params.id;
        const filename = `${id}-${Date.now()}${fileExtension}`;

        // Subir imagen a Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            {
                folder: "tebusco/profiles",
                public_id: filename,
                format: "jpg",
                transformation: [{ width: 300, height: 200, crop: "fill" }]
            },
            (error, result) => {
                if (error) {
                    console.error("Error subiendo a Cloudinary:", error);
                    return res.status(500).json({ error: "Error al subir la imagen a Cloudinary." });
                }

                // Guarda la URL de Cloudinary en req.file
                req.file.path = result.secure_url;
                req.file.originalname = filename;
                req.file.public_id = result.public_id;

                next();
            }
        ).end(req.file.buffer); // Envía el buffer de la imagen
    } catch (error) {
        console.error("Error en resizeAndSave:", error);
        return res.status(500).json({ error: "Error al procesar la imagen." });
    }
}
/*
const resizeAndSave = async (req, res, next) => {
    if(!req.file) return next (new Error('No se cargó ningun archivo y/o imagen.'))

    try{
        const fileExtension = path.extname(req.file.originalname) // Obtengo extensión del archivo (jpg, pdf)
        const buffer = req.file.buffer // Buffer del archivo cargado.

        // Defino la carpeta de destino según el "uploadType"
        let folder = 'public/uploads/'
        if(req.uploadType === 'driverAuth'){
            folder += 'drivers/auth'
        } else if(req.uploadType === 'driverProfile'){
            folder += 'drivers/profile'
        } else if(req.uploadType === 'passengerProfile'){
            folder += 'passengers/profile'
        }

        // Creo la carpeta si no existe
        if(!fs.existsSync(folder)){
            fs.mkdir(folder, { recursive: true })
        }

        // Defino el nombre del archivo
        let filename = ""
        if(req.uploadType === 'driverAuth'){
            filename = `${req.body.dni}${fileExtension}`
        } else {
            const id = req.params.id
            filename = `${id}-${Date.now()}${fileExtension}`

            // Elimina imágenes antiguas de perfil si existen
            const userFiles = fs.readdirSync(folder).filter(file => file.startsWith(id))
            userFiles.forEach(file => fs.unlinkSync(path.join(folder, file)))
        }

        const outputPath = path.join(folder, filename)

        // Procesa según el tipo de archivo.
        if(req.uploadType === 'driverProfile' || req.uploadType === 'passengerProfile'){
            // Redimensiona si es imagen de perfil
            await sharp(buffer)
                .resize(300, 200, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy,
                })
                .toFormat('jpeg', { quality: 80 })
                .toFile(outputPath)
        } else if (req.uploadType === 'driverAuth'){
            fs.writeFileSync(outputPath, buffer)
        }

        // Actualizar req.file con la ruta final
        req.file.path = outputPath
        req.file.originalname = filename

        next()
    } catch (error) {
        return res.status(500).json({ error: "Error al procesar el archivo." })
    }
}
*/
export default resizeAndSave