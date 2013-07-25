APPROOT = "https://orga.stugen.de/dashboard/";

function updateBSAG(data) {
  if(updateBSAG.timeout)
    clearTimeout(updateBSAG.timeout);
  // cache the data
  if(data)
    updateBSAG.data = data;
  else
    data = updateBSAG.data;
  var template = $('<tr><th><span></span></th><td></td></tr>');
  var elements = new Array(data.length);
  var time = new Date;
  var nextupdate = 60;
  for(var i = 0; i < data.length; i++) {
    elements[i] = template.clone();
    $('span', elements[i])
      .addClass(data[i].type)
      .addClass("line"+data[i].line)
      .append(document.createTextNode(data[i].line));
    var connections = new Array();
    for(var j = 0; j < data[i].connections.length; j++) {
      var connection = data[i].connections[j]-time.getTime()/1000;
      if(connection < 0)
        continue;
      connections.push(Math.floor(connection/60));
      if(connection % 60 < nextupdate)
        nextupdate = connection % 60;
    }
    $('td', elements[i]).append(document.createTextNode(connections.join(", ")));
  }
  $("#bsag table tr").remove();
  $("#bsag table").append(elements);
  console.debug("Next update of BSAG pane in " + nextupdate + " seconds")
  updateBSAG.timeout = setTimeout(updateBSAG, nextupdate * 1000);
}

function updateMensa(data) {
  var template = $('<tr><th></th><td></td></tr>');
  var elements = new Array(data.length);
  for(var i = 0; i < data.length; i++) {
    elements[i] = template.clone();
    $('th', elements[i]).append(document.createTextNode(data[i].name));
    $('td', elements[i]).append(document.createTextNode(data[i].meal));
  }
  $("#mensa table tr").remove();
  $("#mensa table").append(elements);
}

function formatTime(time) {
  return ("0"+time.getHours()).slice(-2) + ":" + ("0"+time.getMinutes()).slice(-2);
}

function updateCalendar(data) {
  var months = new Array("Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez");
  var template = $('<div class="infoblock"><h3></h3></div>');
  var eventtemplate = $('<li><span class="date"><span class="day"></span><span class="hidden">. </span><span class="month"></span></span> <span class="time"></span> <span class="title"></span></li>');
  var elements = new Array(data.length);
  for(var i = 0; i < data.length; i++) {
    elements[i] = template.clone();
    var newevent;
    $('h3', elements[i]).append(document.createTextNode(data[i].name));
    for(var j = 0; j < data[i].events.length; j++) {
      newevent = eventtemplate.clone();
      var startdate = new Date(data[i].events[j].start*1000);
      var enddate = new Date(data[i].events[j].end*1000);
      $(".day", newevent).append(document.createTextNode(startdate.getDate()));
      $(".month", newevent).append(document.createTextNode(months[startdate.getMonth()]));
      $(".time", newevent).append(document.createTextNode(formatTime(startdate) + "–" + formatTime(enddate)));
      $(".title", newevent).append(document.createTextNode(data[i].events[j].title));
      elements[i].append(newevent);
    }
  }
  $("#calendar .infoblock").remove();
  $("#calendar").append(elements);
}

function updateAll() {
  if(updateAll.timeout)
    clearTimeout(updateAll.timeout);
  $.ajax(APPROOT + "data.php").done(function(data, textStatus, jqXHR) {
    updateBSAG(data.bsag);
    updateMensa(data.mensa);
    updateCalendar(data.calendar);
    updateAll.timeout = setTimeout(updateAll, 15*60*1000); // update every 15 minutes
  });
}
