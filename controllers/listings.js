const appRoot = require("app-root-path")
const cloudinary = require('cloudinary').v2
const Listing = require(`${appRoot}/db/models/listings`)
const {getResponseMessage} = require(`${appRoot}/utils`)


module.exports = function ListingController() {

    this.getAllListings = async (req, res) => {
        const listings = await Listing.find({})
        return getResponseMessage(res, 200, false, "Successful Request", {
            listings
        })
    }

    this.getListing = async (req, res) => {
        const listingID = req.params.id
        const listing = await Listing.findOne({id: listingID})
        return listing ? getResponseMessage(res, 200, false, "Successful Request", {
            listing
        }) : getResponseMessage(res, 404, true, "ID not found", {
            message: 'no such id'
        })
    }

    this.addListing = async (req, res, next) => {
        const listing = req.body
        try {
            const findListing = await Listing.findOne({id: listing.id})
            if (findListing)
                getResponseMessage(res, 500, true, "Listing with ID already exists", {
                    message: 'Listing with ID already exists'
                })
            let images = []
            let publicIDs = []
            for (let i = 0; i < listing.images.length; i++) {
                const resultUpload = await cloudinary.uploader.upload(listing.images[i]);
                images.push(resultUpload.url)
                publicIDs.push(resultUpload.public_id)
            }
            listing.images = images
            listing['publicIDs'] = publicIDs

            const saveListing = await new Listing(listing).save()
            if (saveListing)
                return getResponseMessage(res, 200, false, "Added Listing", {
                    listing: saveListing,
                    message: 'Successfully Added Listing'
                })
            else
                getResponseMessage(res, 500, true, "Error saving listing", {
                    message: 'Internal server error'
                })
        } catch (e) {
            getResponseMessage(res, 500, true, "Error uploading images", {
                message: 'Error uploading images'
            })
        }
    }

    this.editListing = async (req, res) => {
        const listingID = req.params.id
        let updatedListing = req.body
        const findListing = await Listing.findOne({id: listingID}).lean().exec()

        if (!findListing)
            getResponseMessage(res, 404, true, "Listing with given ID does not exist", {
                message: 'Listing with given ID does not exist'
            })
        const toDeleteIndex = []
        let length = findListing.images.length <= updatedListing.images.length ? findListing.images.length : updatedListing.images.length
        for (let i = 0; i < length; i++) {
            if (!IsURL(updatedListing.images[i])) {
                toDeleteIndex.push(i)
            }
        }
        for (let i = 0; i < toDeleteIndex.length; i++) {
            if (!toDeleteIndex[i] > findListing.images.length) {
                toDeleteIndex.splice(i, 1)
            }
        }
        try {
            for (let i = 0; i < toDeleteIndex.length; i++) {
                const deleteResult = await cloudinary.uploader.destroy(findListing.publicIDs[toDeleteIndex[i]])
                if (deleteResult.result !== 'not found') {
                    findListing.publicIDs.splice(toDeleteIndex[i], 1)
                    findListing.images.splice(toDeleteIndex[i], 1)
                }
            }
            for (let i = 0; i < findListing.images.length; i++) {
                if (updatedListing.images.indexOf(findListing.images[i]) === -1) {
                    const deleteResult = await cloudinary.uploader.destroy(findListing.publicIDs[toDeleteIndex[i]])
                    if (deleteResult.result !== 'not found') {
                        findListing.publicIDs.splice(toDeleteIndex[i], 1)
                        findListing.images.splice(toDeleteIndex[i], 1)
                    }
                }
            }
            let images = findListing.images
            let publicIDs = findListing.publicIDs
            for (let i = 0; i < updatedListing.images.length; i++) {
                if (!IsURL(updatedListing.images[i])) {
                    console.log('not url')
                    const resultUpload = await cloudinary.uploader.upload(updatedListing.images[i]);
                    images.push(resultUpload.url)
                    publicIDs.push(resultUpload.public_id)
                }
            }
            updatedListing.images = images
            updatedListing['publicIDs'] = publicIDs
            updatedListing = {
                ...findListing,
                ...updatedListing,
            }
            const editListing = await Listing.findOneAndUpdate({id: listingID}, {$set: updatedListing}, {new: true})
            return getResponseMessage(res, 200, false, "Successful Request", {
                listing: editListing
            })

        } catch (e) {
            getResponseMessage(res, 500, true, "Error removing images", {
                message: 'Internal server error'
            })
        }
    }

    this.deleteListing = async (req, res) => {
        const listingID = req.params.id
        const findListing = await Listing.findOne({id: listingID})
        if (!findListing)
            getResponseMessage(res, 404, true, "Listing with given ID does not exist", {
                message: 'Listing with given ID does not exist'
            })
        try {
            for (let i = 0; i < findListing.images.length; i++) {
                await cloudinary.uploader.destroy(findListing.publicIDs[i])
            }
            const deleteListing = await Listing.findOneAndRemove({id: listingID})
            if (deleteListing)
                return getResponseMessage(res, 200, false, "Successful Request", {
                    listing: findListing,
                    message: "Deleted successfully"
                })
            else
                getResponseMessage(res, 500, true, "Error deleting listing", {
                    message: 'Internal server error'
                })
        } catch (e) {
            getResponseMessage(res, 500, true, "Error removing images", {
                message: 'Internal server error'
            })
        }
    }
}

function IsURL(url) {

    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(url);
}
