
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var gamestate = event.body; 

    client.query(
      q.Create(
        q.Collection('gamestate'),
          { data: gamestate }
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





