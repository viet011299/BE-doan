const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const typeQuestion = ["Read", "Listen", "Other"]
const englishTest = new Schema({
    title: String,
    time: Number,
    questions: [
        {
            typeQ: String,
            paragraph: String,
            answers: [
                {
                    id: String,
                    title: String,
                    content: [
                        {
                            id:String,
                            value: String,
                            result: Boolean
                        }
                    ]
                }
            ]
        }
    ]
},
    {
        usePushEach: true,
        timestamps: true,
    }
);

module.exports = mongoose.model('EnglishTest', englishTest);
