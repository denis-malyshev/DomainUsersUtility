// Client ID and API key from the Developer Console
const CLIENT_ID = '1036277936167-o2jlp8rpoumf95j3tpdcqdaarg62d3ma.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/admin.directory.user.readonly';

let authorizeButton = document.getElementById('signin-button');
let signoutButton = document.getElementById('signout-button');
let content = document.getElementById('content');

function redirectToValidOrigin() {
    if (window.location.href != 'http://localhost:8080/') {
        window.location = 'http://localhost:8080';
    }
}
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    redirectToValidOrigin();
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES,
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = '';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Returns array of users in the domain.
 */
function listUsers(requestParams) {
    return gapi.client.directory.users.list(requestParams).then(function (response) {
        return response.result.users;
    });
}