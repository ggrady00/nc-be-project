
exports.handle404Errors = (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
  };

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    // console.log(err)
    if (err.code == "22P02" || err.code === "23502") {
        res.status(400).send({msg: "Bad Request"})
    } else if (err.code == "23503"){
        res.status(404).send({msg: "Resource not Found"})
    } else if (err.code == "23505") {
        res.status(409).send({msg: "Already Exists"})
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "Internal Server Error"})
}