const config = require('./config');

var Twit = require('twit');
var T = new Twit(config);

T.get('statuses/user_timeline', { screen_name: 'people_enough', count: 1, trim_user: true, exclude_replies: true }, function(err, data, response) {
  var search_params = {
    q: "people don't talk about this enough -filter:retweets",
    result_type: 'recent',
    include_entities: false
  };

  var re = /don(['’]?)t talk about .* enough/g;

  //
  var most_recent = null;
  if (data.length) {
    most_recent = data[0].id_str;
  }
  if (most_recent) {
    search_params['since_id'] = most_recent;
  }
  //

  T.get('search/tweets', search_params, function(err, data, response) {
    var tweets = data.statuses.filter(function(tweet) {
      return re.test(tweet.text.toLowerCase());
    });

    if (tweets.length) {
      var tweet = tweets[tweets.length - 1];

      T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
        console.log(data);
      });
    }
  })
});
