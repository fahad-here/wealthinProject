const appRoot = require("app-root-path")
const expressPromise = require("express-promise-router")

const MiscController = require(`${appRoot}/controllers/misc`)
const router = expressPromise()
const miscController = new MiscController()

router.get('/property-type', miscController.getPropertyTypes)
router.get('/category', miscController.getCategories)
router.get('/listing-type', miscController.getListingTypes)

module.exports = router