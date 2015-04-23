THENOTIF = '';

var DesktopNotifications = {
  enable: function() { // enables the line DesktopNotifications functionality (this is the defualt behavior)
    if (window.Notification) {
      Notification.requestPermission(function(permission){
        if(permission == 'granted'){
          DesktopNotifications.status = true;
        }
      });
    };
  },
  disable: function() { // disable the line DesktopNotifications functionality
    if (DesktopNotifications.status == true) {
      DesktopNotifications.newMsg('Notifications Disabled', '', 'Desktop notifications disabled');
    }
    DesktopNotifications.status = false;
  },
  getParam: function(sname)
  {
    var params = location.search.substr(location.search.indexOf("?")+1);
    var sval = "";
    params = params.split("&");
    // split param and value into individual pieces
    for (var i=0; i<params.length; i++)
    {
      temp = params[i].split("=");
      if ( [temp[0]] == sname ) { sval = temp[1]; }
    }
    return sval;
  },
  newMsg: function(authorName, author, text, sticky, timestamp, timestr){ // Creates a new desktop notification
    var body = $('<textarea />').html(text).text();
    if(DesktopNotifications.status == true && author !== clientVars.userId){
      if(THENOTIF !== ''){
        THENOTIF.close();
      }
      THENOTIF = new Notification(authorName, { icon: null, body: body });
      THENOTIF.onclick = function(){
        alert("Welcome back");
        this.close();
      }
    }
  }
}

var postAceInit = function(hook, context){
  /* initialize status */
  DesktopNotifications.status = false;
  /* init */
  if($('#options-desktopNotifications').is(':checked')) {
    DesktopNotifications.enable();
  } else {
    DesktopNotifications.disable();
  }
  var urlContainsDesktopNotificationsTrue = (DesktopNotifications.getParam("DesktopNotifications") == "true"); // if the url param is set
  if(urlContainsDesktopNotificationsTrue){
    $('#options-desktopNotifications').attr('checked','checked');
    DesktopNotifications.enable();
  }else if (DesktopNotifications.getParam("DesktopNotifications") == "false"){
    $('#options-desktopNotifications').attr('checked',false);
    DesktopNotifications.disable();
  }
  /* on click */
  $('#options-desktopNotifications').on('click', function() {
    if($('#options-desktopNotifications').is(':checked')) {
      DesktopNotifications.enable(); // enables Desktop Notifications
    } else {
      DesktopNotifications.disable(); // disables Desktop Notifications
    }
  });
};
exports.postAceInit = postAceInit;

exports.chatNewMessage = function(e, obj, cb){
  obj.authorName = obj.authorName || "SYSTEM MESSAGE:";
  var now = new Date().getTime();
  if (obj.timestamp+3000 > now && !document.hasFocus()){
    DesktopNotifications.newMsg(obj.authorName, obj.author, obj.text, obj.sticky, obj.timestamp, obj.timeStr);
  }
  cb([null]);
}