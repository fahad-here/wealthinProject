const appRoot = require("app-root-path")
const express = require('express')
const expressPromise = require("express-promise-router")
const router = expressPromise()
const listingRouter = require(`${appRoot}/routes/listings`)
const miscRouter = require(`${appRoot}/routes/misc`)

router.use('/listings', listingRouter)
router.use('/misc', miscRouter)
module.exports = router