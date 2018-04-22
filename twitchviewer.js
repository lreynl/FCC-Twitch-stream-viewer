var streamerData = {};
var key = //api key goes here
var retrievedIdList = {};

$(getTw());

function nowPlaying(url) {
  window.open(url, '_blank');
}

function getTw() {
  var channels = ["ESL_SC2", "OgamingSC2", "carlsagan42", "juzcook", "oshikorosu", "freecodecamp", "Ryukahr", "comster404", "GrandPooBear"];

  apiCall1(channels);

}

function apiCall1(channels) {
  if(channels == []) return;
  var users = "";
  channels.forEach(function(ch) {
    if(users == "") users += "login=";
    else users += "&login=";
    users += ch;
  });

  $.ajax({
    headers: { "Client-ID": key },
    type: 'GET',
    dataType: 'json',
    url: 'https://api.twitch.tv/helix/users?' + users,
    success: function(data) {
      var name ="";
      var id = "";
      data.data.forEach(function(streamer) {
        name = streamer.display_name;
        id = streamer.id;
        streamerData[name] = {};
        streamerData[name]['imageUrl'] = streamer.profile_image_url;
        streamerData[name]['name'] = name;
        retrievedIdList[id] = name;
      });
      apiCall2(channels);
    },
    error: function() {
      console.log("couldn't get data: ");
    }
  });
}

function apiCall2(channels) {
  if(channels == []) return;
  var streams = "";
  channels.forEach(function(ch) {
    if(streams == "") streams += "user_login=";
    else streams += "&user_login=";
  streams += ch;
  });

  $.ajax({
    headers: { "Client-ID": key },
    type: 'GET',
    dataType: 'json',
    url: 'https://api.twitch.tv/helix/streams?' + streams,
    success: function(data) {
      var online = [];
      var nowPlaying = {};
      data.data.forEach(function(streamer) {
        online.push(streamer.user_id);
        nowPlaying[streamer.user_id] = streamer.title;
      });
      var keys = Object.keys(retrievedIdList);
      keys.forEach(function(streamer) {
        if(online.includes(streamer)) {
          streamerData[retrievedIdList[streamer]]['status'] = "online";
          streamerData[retrievedIdList[streamer]]['nowPlaying'] = nowPlaying[streamer];
        } else {
          streamerData[retrievedIdList[streamer]]['status'] = "offline";
        }
      });
      buildList();
    },
    error: function() {
      console.log("couldn't get data");
    }
  });
}

function buildList() {
  var streamerList = Object.keys(streamerData);
  streamerList.forEach(function(st) {
    if(streamerData[st].status == "online") {
      document.getElementById("results").innerHTML += "<tr><td><img src=" +
      streamerData[st].imageUrl + " title=\'" + streamerData[st].name +
      "\' class='img-rounded pull-xs-left'/><td><div class='row'><div class='col-xs-12' id='scrolling'><marquee behavior='scroll' direction='left' scrollamount='5'>" +
      streamerData[st].nowPlaying + "</marquee></div></div></td><td><button class='btn btn-xs btn-success pull-right' title='Opens new window' onclick='nowPlaying(\"https://www.twitch.tv/" +
      streamerData[st].name + "\")'>watch</button></td></tr>";//online
    } else {
      document.getElementById("results").innerHTML += "<tr id='offline'><td><img src=" +
      streamerData[st].imageUrl + " title=\'" + streamerData[st].name +
      "\' class='img-rounded pull-xs-left'/></td><td></td><td><button class='btn btn-xs btn-info pull-right' title='Visit " +
      streamerData[st].name + "\`s channel\' onclick='nowPlaying(\"https://www.twitch.tv/" +
      streamerData[st].name + "\")'>offline</button></td></tr>";//offline
    }

  });

}
