const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const result = new Schema({
    test: {
        type: Schema.ObjectId,
        ref: 'EnglishTest',
    },
    user: {
        type: Schema.ObjectId,
        ref: 'UserE',
    },
    answers: [
        {
            result: String,
            id: String
        }
    ]
},
    {
        usePushEach: true,
        timestamps: true,
    }
);
module.exports = mongoose.model('Result', result);