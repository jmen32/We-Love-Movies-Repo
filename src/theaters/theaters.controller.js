const service = require("./theaters.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){
    const data = await service.list();
    // console.log("LIST", JSON.stringify(data))
    res.json({data})
}

module.exports = {
    list: asyncErrorBoundary(list),
}
