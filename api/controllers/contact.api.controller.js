import * as contactService from '../../services/contact.service.js'

async function sendEmail(req, res)
{
    const { name, email, comment } = req.body

    const emailData = {
        from: email,
        subject: `Consulta de ${name}`,
        text: comment,
    }

    await contactService.sendEmail(emailData)
        .then(function(){
            res.status(200).json({ msg: 'Tu email se envió correctamente. Te contestaremos a la brevedad.' })
        })
        .catch((err) => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

export{
    sendEmail
}