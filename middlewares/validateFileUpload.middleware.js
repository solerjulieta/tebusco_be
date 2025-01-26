const validateFileUpload = (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: { msg: req.fileValidationError } })
    }
    if (!req.file) {
        return res.status(400).json({ error: { msg: 'No se cargó ningún archivo válido.' } })
    }
    next()
}

export{
    validateFileUpload
}