
let userSessions = new Map();   // Key - userSessionId  Value - {userId, sessionTime}
const DefaultSessionTime = 5000;    //Session time in seconds

let userSessionObject = {

    createUserSession: function (userId, userEmail) {
        let sessionId = userEmail + userId + process.hrtime()[0];
        userSessions.set(sessionId, { userId: userId, sessionTime: DefaultSessionTime }); //Session time in seconds
        return sessionId;
    },


    //Return -> sha256 key for user session
    getUserBySessionId: function (sessionId) {
        let userSession = userSessions.get(sessionId);
        //Check user date validation
        return userSession?.userId;
    }
}

module.exports = userSessionObject;