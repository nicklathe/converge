/**
 * ConversationController
 *
 * @description :: Server-side logic for managing conversations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    startYelp:function(req, res){

        var yelp = require("yelp").createClient({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            token: process.env.TOKEN,
            token_secret: process.env.TOKEN_SECRET
        });


        // yelp.search({term: "lunch", location: "Seattle"}, function(error, data) {
        yelp.search({term: "lunch", bounds: "47.614850,-122.341454" +  "|" + "47.624106,-122.329910"}, function(error, data) {
            // console.log(error);
            res.send(data);
        });
    }
};

