/**
 * ConversationController
 *
 * @description :: Server-side logic for managing conversations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    //POST  /api/converation/start

    //start
        // create conversation with latA, lonA
        // from req.body.
        // Conversation.create({ ... data ... }).exec(function(err,convo){ })
        // sails.sockets.join(req.socket,'convo_'+convo.id);

    //POST /api/conversation/:id/join
    //join
        // LatB LonB
        // Conversation.update({ ... }).exec(...)
        // Get items from yelp
        // sails.sockets.broadcast('convo_'+req.params.id,'join',{ ... yelp data ... });
        // sails.sockets.join(req.socket,'convo_'+req.params.id);
        // res.send(yelp data and convo)

    // POST /api/conversation/:id/answer
    //answer (?)
        // req.body.user = A or B
        // req.body.answer = true/false or yes/no
        // req.body.index = index in yelp array
        // message name all lower case
        // sails.sockets.broadcast('convo_'+req.params.id,'answer',{ ... });

    //message
        // sails.sockets.broadcast('convo_'+req.params.id,'message',{ ... });

    startConversation:function(req, res) {

        var userA = {
            latA: req.body.latA,
            lonA: req.body.lonA
        }
        Conversation.create(userA).exec(function(err, convo){
            if(err) res.send(400,err);
            sails.sockets.join(req.socket, 'convo_' + convo.id);
            console.log(convo);
            res.send(convo);
        })
    },

    joinConversation:function(req, res){
        console.log('join action');
        var userB = {
            latB: req.body.latB,
            lonB: req.body.lonB
        }
        Conversation.update(req.params.id,userB).exec(function(err, convo){
            if(err) res.send(400,err);

            var userLoc = convo[0];

            var yelp = require("yelp").createClient({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                token: process.env.TOKEN,
                token_secret: process.env.TOKEN_SECRET
            });

            yelp.search({term: "lunch", bounds: userLoc.latA + ',' + userLoc.lonA +  '|' + '47.618427,-122.336265'}, function(error, yelpData) {
                // console.log(error);
                // res.send(data);
                // console.log(yelpData);
                // var yelpData = data;
                var sendData = {yelp: yelpData, convo:convo};
                // sails.sockets.broadcast('convo_' + req.params.id,'join', sendData);
                sails.sockets.join(req.socket, 'convo_' + req.params.id);
                sails.sockets.broadcast('convo_' + req.params.id,'join', sendData);
                console.log(convo);
                res.send(sendData);
            });


            // sails.sockets.broadcast('convo_' + req.params.id,'join', yelpData);
            // sails.sockets.join(req.socket, 'convo_' + req.params.id);
            // console.log(convo);
            // res.send(yelpData);
        })

    },

    answer:function(req, res){
        sails.sockets.broadcast('convo_' + req.params.id, 'answer', req.body);
    },

    startYelp:function(req, res){

        // var yelp = require("yelp").createClient({
        //     consumer_key: process.env.CONSUMER_KEY,
        //     consumer_secret: process.env.CONSUMER_SECRET,
        //     token: process.env.TOKEN,
        //     token_secret: process.env.TOKEN_SECRET
        // });



        // // yelp.search({term: "lunch", location: "Seattle"}, function(error, data) {
        // yelp.search({term: "lunch", bounds: "47.624106,-122.329910" +  "|" + "47.614850,-122.341454"}, function(error, data) {
        //     // console.log(error);
        //     res.send(data);
        // });
    }
};

