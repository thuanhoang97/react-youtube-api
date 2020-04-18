const gapi = window.gapi;

const youtubeApi = {
  API_REST: 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
  profile: null,
  _beforeCallAPICb: null,
  _afterCallAPICb: null,

  init: function (clientId, onSuccess) {
    clientId = clientId || localStorage.getItem("clientId");

    if (!clientId) {
      console.error("Not found client ID!");
    }
    this._beforeCallAPICb && this._beforeCallAPICb();

    gapi.load("client:auth2", () => {
      const config = {
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/youtube"
      };
      gapi.auth2.init(config).then(() => {
        localStorage.setItem('clientId', clientId);

        console.log('Loading API...');
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          this.loadAPI(onSuccess);
        } else {
          gapi.auth2.getAuthInstance()
            .signIn()
            .then(() => {
              localStorage.setItem('clientId', clientId);
              console.log("set me");
              this.loadAPI(onSuccess);
            });
        }
      });
    });
  },

  loadAPI(onSuccess) {
    gapi.client.load(this.API_REST)
    .then(() => {
      console.log('Loaded GAPI client for API');
      this.profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

      this._afterCallAPICb && this._afterCallAPICb();
      onSuccess && onSuccess();
    })
    .catch((err) => {
      this._afterCallAPICb && this._afterCallAPICb();
      console.error("Error loading GAPI client for API", err);
    });
  },

  setCallAPICallbacks(beforeCallAPICb, afterCallAPICb) {
    this._beforeCallAPICb = beforeCallAPICb;
    this._afterCallAPICb = afterCallAPICb;
  },

  getPlayList(pageToken) {
    this._beforeCallAPICb && this._beforeCallAPICb();
    return gapi.client.youtube.playlists.list({
      part: "snippet,contentDetails",
      maxResults: 50,
			mine: true,
			pageToken: pageToken
		})
      .then(function (res) {
        const data = JSON.parse(res.body);

        return {
          nextToken: data.nextToken,
					items: data.items.map(item => {
						return {
							...item.snippet,
              ...item.contentDetails,
              'id': item.id
						}
					})
				};
      })
      .catch((err) => {
        console.error("Execute error", err);
      })
      .then((data) => {
        this._afterCallAPICb && this._afterCallAPICb();
        return data;
      });
  },

  search(key, maxResults = 50) {
    return gapi.client.youtube.search
      .list({
        part: "id",
        maxResults: Math.min(maxResults, 50),
        q: key,
        type: 'video'
      })
      .then((res) => {
        const items = JSON.parse(res.body).items;
        return items.map((item) => item.id);
      })
      .catch((err) => console.log(err));
  },

  deletePlaylist(id) {
    return gapi.client.youtube.playlists.delete({
      'id': id
    });
  },

  createPlaylist(title, cb) {
    return gapi.client.youtube.playlists
      .insert({
        part: 'snippet, status',
        snippet: {
          title: title,
        },
        status: {
          privacyStatus: 'public',
        }
      })
      .then((resData) => {
        const data = JSON.parse(resData.body);
        const newPlaylist = {...data.snippet, 'id': data.id};
        cb && cb(newPlaylist);
      })
      .catch((err) => {
        const errorCode = JSON.parse(err.body).error.code;
        if (errorCode === 403) {
          console.log('Need to log in again');
        }
      });
  },

  addVideoToPlayList (playlistId, video, params) {
    return gapi.client.youtube.playlistItems.insert({
      part: 'snippet',
      'snippet': {
        'playlistId': playlistId,
        'resourceId': video,
        'position': params.position,
      }
    });
  },

  addVideosToPlaylist(playlistId, videos, params) {
    if (videos.length === 0) {
      this._afterCallAPICb && this._afterCallAPICb();
      return;
    };

    const video = videos[0];
    this.addVideoToPlayList(playlistId, video, params)
      .then(() => {
        console.log(`Inserted video: ${JSON.stringify(video)}`);
      })
      .catch((err) => {
        console.error(`Inserted failed video: ${JSON.stringify(video)}`);
      })
      .then(() => {
        if (params.position) {
          params.position += 1;
        }
        this.addVideosToPlaylist(playlistId, videos.slice(1), params);
      });
  },

  newPlaylist(title, key, params) {
    this._beforeCallAPICb && this._beforeCallAPICb();
    this.createPlaylist(title, (newPlaylist) => {
      this.addVideosToPlaylistByKeyword(newPlaylist.id, key, params);
    });
  },

  addVideosToPlaylistByKeyword (playlistId, key, params) {
    youtubeApi.search(key, params.numVideo).then((items) => {
      this._beforeCallAPICb && this._beforeCallAPICb();
      this.addVideosToPlaylist(playlistId, items, params);
    });
  }
};

export default youtubeApi;
