import { withSessionRoute } from '@auth'
import { prisma } from '@db'

export default withSessionRoute('POST', {
    ensureAuthenticated: true
}, async (
    req,
    res
) => {
    const { plate } = req.body
    const user = req.session.user

    const vehicle = await prisma.owned_vehicles.findFirst({
        where: {
            plate: String(plate)
        }
    })

    if (!vehicle) return res.status(404).send({})
    
    const availableVehicleList = (await Promise.all([
        prisma.vs_cars.findMany(),
        prisma.vs_aircrafts.findMany(),
        prisma.vs_boats.findMany()
    ])).flat(1)
    
    const vehicleProperties = availableVehicleList.find(v => v.name === vehicle.name)
    
    if (!vehicleProperties) return res.status(400).send({})

    if (user.identifier !== vehicle.owner) return res.status(403).send({})

    await prisma.web_vehicle_marketplace.create({
        data: {
            image: vehicle.image || '',
            model_name: vehicleProperties.model,
            owner: user.identifier,
            plate: String(plate),
            vehicle: vehicle.vehicle
        }
    })

    res.status(200).send({})
})