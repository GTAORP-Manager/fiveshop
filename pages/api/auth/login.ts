import { prisma } from '@db'
import { withSessionRoute } from '@auth'

export default withSessionRoute('POST', undefined, async (
    req,
    res
) => {

    const {
        firstname,
        lastname,
        password
    } = req.body

    if (req.session !== undefined && req.session.user != null) return res.redirect('/dashboard')

    const user = await prisma.users.findFirst({
        where: {
            lastname,
            firstname
        }
    })

    if (user === null) return res.status(404).send({})

    if (user.web_password_raw === password) {
        req.session.user = {
            group: user.group || 'N/A',
            identifier: user.identifier,
            web_password_raw: ''
        }

        await req.session.save()
        return res.status(200).send({})
    }

    return res.status(401).send({})

})
