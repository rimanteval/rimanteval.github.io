function setCookie(c_name,value,exdays){var exdate=new Date();exdate.setDate(exdate.getDate() + exdays);var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());document.cookie=c_name + "=" + c_value;}

function getCookie(c_name){var c_value = document.cookie;var c_start = c_value.indexOf(" " + c_name + "=");if (c_start == -1){c_start = c_value.indexOf(c_name + "=");}if (c_start == -1){c_value = null;}else{c_start = c_value.indexOf("=", c_start) + 1;var c_end = c_value.indexOf(";", c_start);if (c_end == -1){c_end = c_value.length;}c_value = unescape(c_value.substring(c_start,c_end));}return c_value;}

window.setTimeout(checkSession(),5000);

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
