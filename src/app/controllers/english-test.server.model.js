const mongoose = require('mongoose')
const helper = require('../libs/helper')
const _ = require('lodash')
const EnglishTest = mongoose.model('EnglishTest')
const { handleSuccess, handleError } = require('../../config/response')
exports.list = async (req, res) => {
    const list = await EnglishTest.find();
    handleSuccess(res, 200, list,"Succes")
}
exports.create = async (req, res) => {
    const newEnglishTest = new EnglishTest({
        ...req.body
    })
    await newEnglishTest.save()
    handleSuccess(res, 200, newEnglishTest,"Succes")
}
exports.update = async (req,res)=>{
    console.log(req.body)
    const englishTest = req.test;
    console.log(englishTest)
    _.assignIn(englishTest,req.body)
    await englishTest.save()
    handleSuccess(res, 200, englishTest,"Succes")
}
exports.read = async(req,res)=>{
    const englishTest = req.test;
    handleSuccess(res, 200, englishTest,"Succes")
}
exports.englishTestById = async (req, res, next, id) => {
    try {
        const englishTest = await EnglishTest.findOne({ _id: id })
        if (!englishTest) {
            return next(new Error('Failed to load englishTest ' + id))
        } else {
            req.test = englishTest
            next()
        }
    } catch (error) {
        next(new Error(error.message))
    }
}