const { selectEndpoints } = require("../models/api_routes_model")

exports.getEndpoints = (req, res) => {
    res.status(200).send({endpoints: selectEndpoints()})
}