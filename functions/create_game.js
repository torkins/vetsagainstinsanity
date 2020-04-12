
var faunadb = require('faunadb');

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    client.query(
      q.CreateDatabase({ name: 'ZZTOP' })
    )
    .then((ret) => callback(null, {
        statusCode: 200,
        body: "here: " + JSON.stringify(ret)
    }));
}





