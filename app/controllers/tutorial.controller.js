const db = require('../models')
const Tutorial = db.tutorials
const Op = db.Sequelize.Op

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0

  return { limit, offset }
}

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { totalItems, tutorials, totalPages, currentPage }
}

// create and save new tutorial
exports.create = (req, res) => {
  // validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
    return
  }

  // create tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  }

  // save tutorial to db
  Tutorial.create(tutorial)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Tutorial.',
      })
    })
}

// find all tutorials from db
exports.findAll = (req, res) => {
  const { page, size, title, _order } = req.query
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({
    limit,
    offset, 
    where: condition,
    order: [
      ['title', _order || 'ASC'],
      ['createdAt', 'DESC'],
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      })
    })
}

// find single Tutorial by id
exports.findOne = (req, res) => {
  const id = req.params.id

  Tutorial.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Tutorial with id=' + id,
      })
    })
}

// find all published tutorials (condition)
exports.findAllPublished = (req, res) => {
  const { page, size, title, _order } = req.query
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ 
    where: { 
      [Op.and]: [
        condition,
        {published: true}
      ]
    },
    limit,
    offset,
    order: [
      ['title', _order || 'ASC'],
      ['createdAt', 'DESC'],
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      })
    })
}

// update tutorial by id
exports.update = (req, res) => {
  const id = req.params.id

  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Tutorial was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Tutorial with id=' + id,
      })
    })
}

// delete tutorial by id
exports.delete = (req, res) => {
  const id = req.params.id

  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Tutorial was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Tutorial with id=' + id,
      })
    })
}

// delete all tutorials from db
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all tutorials.',
      })
    })
}
