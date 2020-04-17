
var faunadb = require('faunadb');
var q = faunadb.query;

exports.handler = function(event, context, callback) {
    var client = new faunadb.Client({ secret: 'fnADpNJRxKACEjNGbUCEnPNjOjbRG12_5qJ7VOEu' });

    var gamestate = event.body; 
    var data = JSON.parse(gamestate);
    console.info("gamestate: " + gamestate); 
    //remove ref
    var ref = data.ref;
    console.info("ref: " + ref);
    data.ref = null;

    client.query(
      q.Update(
          q.Ref(q.Collection('GameState'), ref),
          { "data": data } 
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





