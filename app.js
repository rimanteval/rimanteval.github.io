function waitForSm(callback) {
    if (typeof sm !== 'undefined') {
        callback();
    } else {
        setTimeout(function() {
            waitForSm(callback);
        }, 100);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

function goToQueue(queueId) {
    waitForSm(function() {
        sm.getApi({
            version: "v1",
        })
            .then(function(glia) {
                return glia.queueForEngagement("text", { queueId: queueId });
            })
            .catch(function(error) {
                console.log(error);
            });
    });
}

window.goToQueue = goToQueue;

function updateVisitAttribute(isFirstVisit) {
    sm.getApi({ version: "v1" }).then(function(glia) {
        glia
            .updateInformation({
                customAttributesUpdateMethod: "merge",
                customAttributes: {
                    first_time: isFirstVisit ? "true" : "false",
                },
            })
            .catch(function(error) {
                if (error.cause === glia.ERRORS.NETWORK_TIMEOUT) {
                    console.log("update timed out");
                } else {
                    console.log("update failed");
                }
            });
    });
}

function checkSession() {
    var visitedCookie = getCookie("visited");
    var isFirstVisit = visitedCookie !== "yes";

    waitForSm(function() {
        updateVisitAttribute(isFirstVisit);
    });

    setCookie("visited", "yes", 365);
}

waitForSm(function() {
    window.setTimeout(checkSession, 5000);
});
