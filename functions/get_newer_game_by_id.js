
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var qstring = event.queryStringParameters;
    console.info("qstring: " + JSON.stringify(qstring));
    var gameId = qstring["id"];
    var ts = qstring["ts"];
    var match = q.Match(q.Index('game_ts_by_id'), gameId);

    //first get the ts of the game, if it is > ts, get the game
    client.query(
        q.Paginate(match)
    ).then( (ret) => {
        let gameTs = ret.data;
        console.info(ts + " < " + gameTs + " = " (ts < gameTs));
        if (ts < gameTs) {
            client.query(q.Get(match))
            .then( (ret) => callback(null, {
                statusCode: 200,
                body: JSON.stringify(ret)
            }));
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({updated: false})
            });
        }
    });
}





