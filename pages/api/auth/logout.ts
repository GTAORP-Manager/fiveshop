import { withSessionRoute } from '@auth'

export default withSessionRoute('POST', undefined, async (
    req,
    res
) => {

    req.session.destroy()

    res.status(200).send({})

})
