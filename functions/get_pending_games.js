
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    console.info("higuys");
    client.query(
        q.Intersection(q.Match(q.Index('games_by_hasstarted'), false))
    )
    .then(
        (ret) => {
            console.info("pending: " + JSON.stringify(ret));
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(ret)
            });
        },
        (err) => {
            console.info("ERR: " + JSON.stringify(err));
            callback(err)
        }
    );
}





