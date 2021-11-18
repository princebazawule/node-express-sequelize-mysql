module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js")
  
    var router = require("express").Router()
  
    // create new tutorial
    router.post("/", tutorials.create)
  
    // get all tutorials
    router.get("/", tutorials.findAll)
  
    // get all 'published' tutorials
    router.get("/published", tutorials.findAllPublished)
  
    // get single tutorial by id
    router.get("/:id", tutorials.findOne)
  
    // update single tutorial by id
    router.put("/:id", tutorials.update)
  
    // delete single tutorial by id
    router.delete("/:id", tutorials.delete)
  
    // delete all tutorials
    router.delete("/", tutorials.deleteAll)
  
    app.use('/api/tutorials', router)
  }