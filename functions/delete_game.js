
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var data = JSON.parse(event.body);
    console.info("refId: " + data[0]); 

    client.query(
      q.Delete(
        q.Collection('GameState'), refId
      )
    )
    .then(
        (ret) => callback(null, {
            statusCode: 200,
            body: JSON.stringify({})
        }),
        (err) => callback(err)
    );
}





