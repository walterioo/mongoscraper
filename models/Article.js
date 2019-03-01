var moongose = require ("mongoose");

var Schema = moongose.Schema;

var ArticleSchema = new Schema({

    title: {
        type : String, 
        required: true,
        unique: true
    }, 

    link: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String, 
        required: true
    }, 

    saved: {
        type: Boolean,
        required: true
    },

    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

var Article = moongose.model("Article", ArticleSchema);

module.exports = Article;