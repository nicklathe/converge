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

            res.send(convo);
        })
    },

    joinConversation:function(req, res){

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

            var distanceCheck = function(a, b){
                return Math.abs(a - b);
            }

            if(Math.abs(userLoc.latA - userLoc.latB) <= 0.0003 || Math.abs(userLoc.lonA - userLoc.lonB) <= 0.0003){
                // console.log('single search');
                yelp.search({term: 'lunch', ll: userLoc.latA + ',' + userLoc.lonA}, function(error, yelpData){
                    var sendData = {yelp: yelpData, convo:convo};

                    sails.sockets.join(req.socket, 'convo_' + req.params.id);
                    sails.sockets.broadcast('convo_' + req.params.id,'join', sendData);

                    res.send(sendData);
                });
            } else {
                yelp.search({term: "lunch", bounds: userLoc.latA + ',' + userLoc.lonA +  '|' + userLoc.latB + ',' + userLoc.lonB}, function(error, yelpData) {

                    var sendData = {yelp: yelpData, convo:convo};

                    sails.sockets.join(req.socket, 'convo_' + req.params.id);
                    sails.sockets.broadcast('convo_' + req.params.id,'join', sendData);

                    res.send(sendData);
                });
            }

            // yelp.search({term: 'lunch', bounds: userLoc.latA + ',' + userLoc.lonA +  '|' + '47.618427,-122.336265'}, function(error, yelpData) {
            // yelp.search({term: "lunch", bounds: userLoc.latA + ',' + userLoc.lonA +  '|' + userLoc.latB + ',' + userLoc.lonB}, function(error, yelpData) {

            //     var sendData = {yelp: yelpData, convo:convo};

            //     sails.sockets.join(req.socket, 'convo_' + req.params.id);
            //     sails.sockets.broadcast('convo_' + req.params.id,'join', sendData);

            //     res.send(sendData);
            // });
        })

    },

    answer:function(req, res){
        sails.sockets.broadcast('convo_' + req.params.id, 'answer', req.body);
    }
};

