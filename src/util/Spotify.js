const clientID = process.env.REACT_APP_CLIENT_ID;
const redirectURI = 'http://localhost:3000/';
let accessToken;

const Spotify = {
    getAccessToken() {
        //Token already exists
        if (accessToken) {
            return accessToken;
        };
        
        //Look for token in the URL
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //clear the token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            // open Spotify login screen
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }
    },

    search(userSearch) {
        //select the token
        const accessToken = Spotify.getAccessToken();
        
        //return the list of tracks
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${userSearch}`,
            {
                headers: {Authorization: `Bearer ${accessToken}`}
            }
        ).then(response => {
           return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackUris) {
        //if one argument is missing, leave the method
        if (!name || !trackUris.length) {
            return;
        }

        //set variables
        const accessToken = Spotify.getAccessToken();
        const header = {
            Authorization: `Bearer ${accessToken}`
        }
        let userId;
        
        //request the user ID
        return fetch(`https://api.spotify.com/v1/me`,
            {
                headers: header
            }).then(response => response.json()
            ).then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: header,
                        method: 'POST',
                        body: JSON.stringify({name: name})
                    }
                ).then(response => response.json()
                ).then(jsonResponse => {
                    const playlistId = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                        {
                            headers: header,
                            method: 'POST',
                            body: JSON.stringify({uris: trackUris})
                        }
                    )
                })
            })
    }
};

export default Spotify;