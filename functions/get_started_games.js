
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    console.info("higuys");
    client.query(
        q.Paginate(q.Match(q.Index('games_by_hasstarted'), true))
    )
    .then(
        (ret) => {
            console.info("pending: " + JSON.stringify(ret));
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(ret.data)
            });
        },
        (err) => {
            console.info("ERR: " + JSON.stringify(err));
            callback(err)
        }
    );
}





