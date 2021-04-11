const _ = require('lodash')
const mongoose = require('mongoose')
const Building = mongoose.model('Building')
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')
const ObjectId = require('mongoose').Types.ObjectId;
const Room = mongoose.model('Room')

exports.list = async (req, res) => {
    try {
        const list = await Building.find();
        return handleSuccess(res, 200, list, "Get list")
    } catch (error) {
        return handleError(res, 400, error.message)
    }
}



exports.create = async (req, res) => {
    try {
        const body = req.body;
        body.buildingID = body.buildingID ? body.buildingID.toUpperCase() : ""
        const newItem = new Building(req.body)
        await newItem.save()
        return handleSuccess(res, 200, newItem, "Success")
    } catch (error) {
        handleError(res, 400, error.message)
    }
}
exports.read = async (req, res) => {
    try {
        const item = req.item
        const listRoom = await Room.find({ buildingId: helper.getObjectId(item) });
        handleSuccess(res, 200, {item,listRoom}, 'Success')
    } catch (error) {
        handleError(res, 400, error.message)
    }
}

exports.update = async (req, res) => {
    try {
        const item = req.item
        const body = req.body
        if (body.buildingID) {
            body.buildingID = body.buildingID.toUpperCase()
        }
        _.assignIn(item, body)
        await item.save()
        handleSuccess(res, 200, item, 'Update  success')
    } catch (error) {
        return handleError(res, 400, error.message)
    }
}
exports.delete = async (req, res) => {
    try {
        const item = req.item
        await item.remove()
        handleSuccess(res, 200, item, 'Delete success')
    } catch (error) {
        handleError(res, 400, error.message)
    }
}

exports.itemById = async (req, res, next, id) => {
    try {
        if (!ObjectId.isValid(id)) {
            return next(new Error('Id not ObjectId'))
        }
        const item = await Building.findById({ _id: id })
        if (!item) {
            return next(new Error('Failed to load Building ' + id))
        } else {
            req.item = item
            next()
        }
    } catch (error) {
        next(new Error(error.message))
    }
}
