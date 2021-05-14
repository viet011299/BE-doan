const _ = require('lodash')
const mongoose = require('mongoose')
const Room = mongoose.model('Room')
const Building = mongoose.model('Building')
const helper = require('../libs/helper')
const { handleError, handleSuccess } = require('../../config/response')
const ObjectId = require('mongoose').Types.ObjectId;

exports.list = async (req, res) => {
    try {
        const list = await Room.find();
        return handleSuccess(res, 200, list, "Get list")
    } catch (error) {
        return handleError(res, 400, error.message)
    }
}

exports.create = async (req, res) => {
    try {
        const body = req.body;
        if (!body.floor || body.floor <= 0 || body.floor == null) {
            return handleError(res, 400, "Floor not Invalid")
        }
        if (!body.buildingId) {
            return handleError(res, 400, "Building null")
        }
        const checkBuilding = await Building.findOne({ _id: body.buildingId })
        if (!checkBuilding) {
            return handleError(res, 400, "Building not exist")
        }
        if (body.floor > checkBuilding.numberFloor) {
            return handleError(res, 400, "floor not available")
        }
        if (!body.roomName) {
            return handleError(res, 400, "Room Name null")
        }
        const existRoom = await Room.findOne({buildingId: body.buildingId,roomName: body.roomName})
        if(existRoom){
            return handleError(res, 400, "Room exist in building")
        }
        const newItem = new Room(req.body)
        await newItem.save()
        return handleSuccess(res, 200, newItem, "Success")
    } catch (error) {
        handleError(res, 400, error.message)
    }
}
exports.read = async (req, res) => {
    try {
        const item = req.item
        handleSuccess(res, 200, item, 'Success')
    } catch (error) {
        handleError(res, 400, error.message)
    }
}

exports.update = async (req, res) => {
    try {
        const item = req.item
        const body = req.body
        const building = await Building.findOne({ _id: item.buildingId })
        if (body.floor || body.floor == 0) {
            if (body.floor <= 0 || body.floor > building.numberFloor) return handleError(res, 400, `Floor not Invalid  must in (${1},${building.numberFloor}) `)
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
        const item = await Room.findById({ _id: id })
        if (!item) {
            return next(new Error('Failed to load Room ' + id))
        } else {
            req.item = item
            next()
        }
    } catch (error) {
        next(new Error(error.message))
    }
}
