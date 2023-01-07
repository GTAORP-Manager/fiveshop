import { prisma } from '@db'
import { withSessionRoute } from '@auth'

export default withSessionRoute('GET', undefined, async (
    req,
    res
) => {

    if (req.session == undefined || req.session.user == null) return res.status(403).send({})

    const user = await prisma.users.findFirst({
        where: {
            identifier: req.session.user.identifier
        }
    })

    if (user === null) return res.status(404).send({})

    return res.status(200).send({ user })

})
