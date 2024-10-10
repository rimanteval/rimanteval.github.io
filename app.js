function waitForSm(callback) {
    if (typeof sm !== 'undefined') {
        callback();
    } else {
        setTimeout(function() { waitForSm(callback); }, 100);
    }
}
waitForSm(function() {
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    window.setTimeout(checkSession, 5000);
   function goToQueue(q1){
      sm.getApi({
         version: 'v1'
      }).then(function(glia) {
         glia.queueForEngagement('text', {queueId: q1})
            .catch(function(error) { 
            console.log(error);
         });
      });
   }
      
      
   function checkSession(){
      var c = getCookie("visited");
      if (c === "yes") {
           sm.getApi({
           version: 'v1'
           }).then(function(glia) {
           glia.updateInformation({
             customAttributesUpdateMethod: 'merge',
             customAttributes: {
               first_time: "false"
             }
           }).then(function() {
             console.log("1");
           }).catch(function(error) {
             if (error.cause == glia.ERRORS.NETWORK_TIMEOUT) {
               console.log("2");
             } else {
               console.log("3");
             }
           });
         });
      } else {
          console.log("has not visited before");
          sm.getApi({
           version: 'v1'
           }).then(function(glia) {
           glia.updateInformation({
             customAttributes: {
               first_time: "true"
             }
           });
         });
      }
      setCookie("visited", "yes", 365); // expire in 1 year; or use null to never expire
   }
});
