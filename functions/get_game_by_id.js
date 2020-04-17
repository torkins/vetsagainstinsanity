
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var qstring = event.queryStringParameters;
    console.info("qstring: " + JSON.stringify(qstring));
    var gameId = qstring["id"];

    client.query(
      q.Get(
        q.Match(q.Index('state_by_gameid'), gameId)
      )
    )
    .then((ret) => callback(null, {
        statusCode: 200,
        body: JSON.stringify(ret)
    }));
}





