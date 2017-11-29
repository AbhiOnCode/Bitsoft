function getRandom() {
  window.open("https://en.wikipedia.org/wiki/Special:Random");
}
//--------------------------------------------------------------
function getResult(json) {
  var html = "";
  $.each(json.query.search, function(i, item) {
    var link= "https://en.wikipedia.org/wiki/" + item.title;
    html += "<div class=\"well\"><a href = "+link+"><h3>" + item.title + ":</h3><br/><h5>" + item.snippet + "</h5></a></div>";
  });
  $("#resultant").html(html);
}
//--------------------------------------------------------------
function getJson() {
  var inp = $("input").val();
  if (inp === "") {
    $("#resultant").html("");
  } else {
    var apiurl = 'https://en.wikipedia.org/w/api.php?' +
      'action=query&list=search&format=json&srprop=snippet' +
      '&srsearch=' + inp + '&callback=?';
    $.getJSON(apiurl, getResult);
  }
}
//----------------------------------------------------------------
$(document).ready(function() {
  $(".btn").on("click", getRandom);
  $("input").keyup(getJson);
});