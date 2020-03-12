require('dotenv').config()

const appRoot = require("app-root-path")
const chai = require('chai')
let request = require('supertest')

const {
    REST_API_LOCAL_ENDPOINT,
} = require(`${appRoot}/constants`)


const expect = chai.expect
const assert = chai.assert

request = request(REST_API_LOCAL_ENDPOINT);


describe('Rest API', async () => {
    let listingID = null
    it('should fetch all listings', done => {
        (async () => {
            try {
                request
                    .get('/api/v1/listings/')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body.payload).to.be.a('object')
                        expect(response.body.payload.listings).to.be.a('array')
                        assert(response.body.message, "Successful Request")
                        done()
                    })
            } catch (e) {
                done(e)
            }
        })()
    })
    it('should add a listing', done => {
        (async () => {
            try {
                const testListing = {
                    id: 2,
                    unitNumber: 303,
                    propertyType: 'Apartment',
                    category: 'Sale',
                    location: 'Sportscity',
                    bedrooms: 5,
                    bathrooms: 6,
                    listingType: 'Furnished',
                    listingPrice: 6000,
                    title: 'Test Title',
                    description: 'Test Description',
                    images: [
                        "https://i0.wp.com/wealthinproperties.com/wp-content/uploads/2019/04/Al-Burooj-Real-Estate_logo.jpg?w=300&ssl=1",
                        "https://i0.wp.com/wealthinproperties.com/wp-content/uploads/2019/04/Developers.jpg?w=400&ssl=1"
                    ]
                }
                request
                    .post('/api/v1/listings/')
                    .send(testListing)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.payload).to.be.a('object')
                        listingID = response.body.payload.listing.id
                        done()
                    })
            } catch (e) {
                done(e)
            }
        })()
    }).timeout(10000)
    it('should allow the user fetch a listing', done => {
        (async () => {
            try {
                request
                    .get('/api/v1/listings/' + listingID)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body.payload).to.be.a('object')
                        expect(response.body.payload.listing).to.be.a('object')
                        done()
                    })
            } catch (e) {
                done(e)
            }
        })()
    }).timeout(10000)
    it('should allow the user to edit a listing', done => {
        (async () => {
            try {
                const testListing = {
                    id: 2,
                    unitNumber: 303,
                    propertyType: 'Apartment',
                    category: 'Sale',
                    location: 'Sportscity',
                    bedrooms: 5,
                    bathrooms: 6,
                    listingType: 'Furnished',
                    listingPrice: 7000,
                    title: 'Test Title',
                    description: 'Test Description',
                    images: [
                        "https://i0.wp.com/wealthinproperties.com/wp-content/uploads/2019/04/Al-Burooj-Real-Estate_logo.jpg?w=300&ssl=1",
                        "https://i0.wp.com/wealthinproperties.com/wp-content/uploads/2019/04/Developers.jpg?w=400&ssl=1"
                    ]
                }

                request
                    .put('/api/v1/listings/' + listingID)
                    .send(testListing)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body.message).to.be.a('string')
                        assert(response.body.message, "Successful Request")
                        assert(response.body.payload.listing.listingPrice, 7000)
                        done()
                    })
            } catch (e) {
                done(e)
            }
        })()
    }).timeout(10000)
    it('should allow the user to delete a listing', done => {
        (async () => {
            try {
                request
                    .delete('/api/v1/listings/' + listingID)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body.message).to.be.a('string')
                        assert(response.body.message, "Successful Request")
                        listingID = null
                        done()
                    })
            } catch (e) {
                done(e)
            }
        })()
    }).timeout(10000)
})
