const appRoot = require("app-root-path")

const {getResponseMessage} = require(`${appRoot}/utils`)


module.exports = function ListingController() {

    this.getPropertyTypes = async (req, res) => {
        const propertyTypes = ["Apartment", "Factory", "Hotel Apartment", "Houses/Villas", "Lands/Plots", "Multiple Sale Units", "Office", "Penthouse", "Retail", "Shop", "Warehouse"]
        return getResponseMessage(res, 200, false, "Successful Request", {
            propertyTypes
        })
    }

    this.getCategories = async (req, res) => {
        const category = ["Sale", "Appraisal", "Rent", "Manage"]
        getResponseMessage(res, 200, false, "Successful Request", {
            category
        })
    }

    this.getListingTypes = async (req, res) => {
        const listingTypes = ["Furnished", "Unfurnished", "Semi Furnished", "Upgraded"]
        getResponseMessage(res, 200, false, "Successful Request", {
            listingTypes
        })
    }
}
