
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var gameType = "vetsagainstinsanity";

    client.query(
      q.Get(
        q.Match(q.Index('deck_by_gametype_and_decktype'), gameType, "Answers")
      )
    )
    .then(
        (ret) => callback(null, {
            statusCode: 200,
            body: JSON.stringify(ret)
        }),
        (err) => callback(err)
    );
}





