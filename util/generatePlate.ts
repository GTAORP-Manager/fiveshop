import { prisma } from '@db'
import RandExp from 'randexp'

export default async() => {

    const ownedVehicles = await prisma.owned_vehicles.findMany()
    const registredPlatesList = ownedVehicles.map(o => o.plate)

    let plateAvailable = false, 
        plate = ''

    while (!plateAvailable) {
        const newPlate = new RandExp(/^[A-Z]{3} [0-9]{3}/).gen()
        if (registredPlatesList.find(r => r === newPlate)) continue
        else {
            plate = newPlate
            plateAvailable = true
        }
    }

    return plate
}