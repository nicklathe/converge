
    var config = {
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            token: process.env.TOKEN,
            token_secret: process.env.TOKEN_SECRET
        }
        console.log(config)
        var yelp = require("yelp").createClient({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            token: process.env.TOKEN,
            token_secret: process.env.TOKEN_SECRET
        });
        console.log(yelp);

        yelp.search({term: "food", location: "Seattle"}, function(error, data) {
            // console.log(data,error);
            console.log(JSON.stringify(data, null, 4));
            // res.send(data);
        });