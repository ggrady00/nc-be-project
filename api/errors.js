
exports.handle404Errors = (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
  };

exports.handleCustomErrors = (err, req, res, next) => {
    console.log(err)
    if (err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}