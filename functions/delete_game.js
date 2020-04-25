
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var data = JSON.parse(event.body);
    console.info("refId: " + data.refId); 

    client.query(
      q.Delete(
        q.Ref(q.Collection('GameState'), data.refId)
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





