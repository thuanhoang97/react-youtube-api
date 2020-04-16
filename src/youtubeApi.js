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
      gapi.auth2.init({ client_id: clientId }).then(() => {
        localStorage.setItem('clientId', clientId);

        console.log('Loading API...');
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          this.loadAPI(onSuccess);
        } else {
          gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube"})
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

      // console.log(this.profile.getName());
      // console.log(this.profile.getImageUrl());
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
        part: "snippet",
        snippet: {
          title: title,
        },
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

  addVideoToPlayList (playlistId, video) {
    return gapi.client.youtube.playlistItems.insert({
      part: 'snippet',
      'snippet': {
        'playlistId': playlistId,
        'resourceId': video,
      }
    });
  },

  addVideosToPlaylist(playlistId, videos) {
    if (videos.length === 0) {
      this._afterCallAPICb && this._afterCallAPICb();
      return;
    };

    const video = videos[0];
    this.addVideoToPlayList(playlistId, video)
      .then(() => {
          console.log(`Inserted video ${JSON.stringify(video)} into playlist ${playlistId}`);
          this.addVideosToPlaylist(playlistId, videos.slice(1));
      })
      .catch((err) => {
        this.addVideosToPlaylist(playlistId, videos.slice(1));
        console.log(`Failed insert video ${JSON.stringify(video)} to playlist ${playlistId}, err: ${err}`);
      });
  },

  newPlaylist(title, key, numItem) {
    this._beforeCallAPICb && this._beforeCallAPICb();
    this.createPlaylist(title, (newPlaylist) => {
      this.addVideosToPlaylistByKeyword(newPlaylist.id, key, numItem);
    });
  },

  addVideosToPlaylistByKeyword (playlistId, key, numItem) {
    youtubeApi.search(key, numItem).then((items) => {
      this._beforeCallAPICb && this._beforeCallAPICb();
      // this.addVideosToPlaylist(playlistId, items);
    });
  }
};

export default youtubeApi;
