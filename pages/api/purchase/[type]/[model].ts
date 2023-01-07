import { withSessionRoute } from '@auth'
import { prisma } from '@db'
import modelNameToHash from '@util/modelNameToHash'
import generatePlate from '@util/generatePlate'

export default withSessionRoute('POST', {
    ensureAuthenticated: true
}, async (
    req,
    res
) => {
    const { type, model } = req.query
    const user = req.session.user

    const vehicles = (await Promise.all([
        prisma.vs_cars.findMany(),
        prisma.vs_aircrafts.findMany(),
        prisma.vs_boats.findMany()
    ])).flat(1)

    const vehicle = vehicles.find(v => v.model === model)

    if (!vehicle) return res.status(400).send({})

    const currentUser = (await prisma.users.findFirst({
        where: {
            identifier: user.identifier
        }
    }))

    if (!currentUser) return res.status(400).send({})

    const plate = await generatePlate()
    const modelhash = await modelNameToHash(vehicle.model)

    if (!modelhash) return res.status(503).send({})

    // Create billing
    await prisma.billing.create({
        data: {
            identifier: currentUser.identifier,
            sender: 'char3:e9bf273ea5e0a8eecf986834dc1bd597149a7e46',
            target_type: 'society',
            target: 'web_shop',
            label: `Rechnung für Onlineeinkauf: ${vehicle.name}`,
            amount: vehicle.price
        }
    })

    // Add vehicle to owned_vehicles
    await prisma.owned_vehicles.create({
        data: {
           owner: currentUser.identifier,
           plate,
           vehicle: JSON.stringify({
            plate,
            model: modelhash,
            fuelLevel: 100
           }),
           type: String(type),
           job: 'civ',
           category: vehicle.category,
           name: vehicle.name,
           fuel: 100,
           stored: true,
           image: vehicle.image
        }
    })

    // Add vehicle to stored vehicles
    res.status(200).send({})
})