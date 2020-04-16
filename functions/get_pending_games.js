
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var gameType = "vetsagainstinstanity";

    client.query(
      q.Get(
        q.Match(q.Index('games_by_started'), false)
      )
    )
    .then(
        (ret) => callback(null, {
            statusCode: 200,
            body: JSON.stringify(ret[0)
        }),
        (err) => callback(err)
    );
}





