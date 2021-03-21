const mongoose = require('mongoose')
const helper = require('../libs/helper')
const _ = require('lodash')
const Result = mongoose.model('Result')
const EnglishTest = mongoose.model('EnglishTest')
const { handleSuccess, handleError } = require('../../config/response')
exports.show = async (req, res) => {
    const { user, test } = req.body
    const result = await Result.findOne({ user: user, test: test }).populate('test')
    if (!result) {
        return handleError(res, 400, "Bạn chưa làm bài")
    } else {
        return handleSuccess(res, 200, result, "Succes")
    }
}
exports.create = async (req, res) => {
    console.log(req.body)
    const { answers, user, test } = req.body
    const result = await Result.findOne({ user: user,test:test })
    if (result) {
        result.answers = answers
        result.save()
        return handleSuccess(res, 200, result, "Succes")
    }
    const newResult = new Result(req.body)
    await newResult.save()
    handleSuccess(res, 200, newResult, "Succes")
}
exports.read = async (req, res) => {
    const result = req.result;
    handleSuccess(res, 200, result, "Succes")
}
exports.resultById = async (req, res, next, id) => {
    try {
        const result = await Result.findOne({ _id: id })
        if (!result) {
            return next(new Error('Failed to load englishTest ' + id))
        } else {
            req.result = result
            next()
        }
    } catch (error) {
        next(new Error(error.message))
    }
}