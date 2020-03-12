const appRoot = require("app-root-path")
const expressPromise = require("express-promise-router")

const ListingController = require(`${appRoot}/controllers/listings`)
const {validateBody, schemas} = require(`${appRoot}/utils`)
const router = expressPromise()
const listingController = new ListingController()

router.get('/', listingController.getAllListings)
router.get('/:id', listingController.getListing)
router.post('/'/*, validateBody(schemas.listingSchema)*/, listingController.addListing)
router.delete('/:id', listingController.deleteListing)
router.put('/:id', validateBody(schemas.listingSchema), listingController.editListing)

module.exports = router