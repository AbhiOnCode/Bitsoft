$(document).ready(function() {

  var backcolor = ["#1dd2af", "#2ecc71", "#3498db", "#9b59b6", "#16a085","#27ae60","#2980b9","#8e44ad","#f1c40f","#e67e22","#e74c3c","#95a5a6","#f39c12",
"#d35400","#c0392b","#c0392b","#7f8c8d" ];

  //quote object
  var quotes = [{
    quote: "I invented the term 'Object-Oriented', and I can tell you I did not have C++ in mind.",
    name: "Alan Kay"
  }, {
    quote: "The use of COBOL cripples the mind; its teaching should therefore be regarded as a criminal offense.",
    name: "E.W. Dijkstra"
  }, {
    quote: "Beware of bugs in the above code; I have only proved it correct, not tried it.",
    name: "Donald Knuth"
  }, {
    quote: "Computer system analysis is like child-rearing; you can do grievous damage, but you cannot ensure success",
    name: "Tom DeMarco "
  }, {
    quote: "PHP is a minor evil perpetrated and created by incompetent amateurs, whereas Perl is a great and insidious evil, perpetrated by skilled but perverted professionals",
    name: "Jon Ribbens"
  }, {
    quote: "I'm not a real programmer. I throw together things until it works then I move on. The real programmers will say: Yeah, it works but you're leaking memory everywhere. Perhaps we should fix that. I'll just restart Apache every 10 requests",
    name: "Rasmus Lerdorf"
  }, {
    quote: "A programming language is low level when its programs require attention to the irrelevant.",
    name: "Alan J. Perlis"
  }, {
    quote: "It should be noted that no ethically-trained software engineer would ever consent to write a DestroyBaghdad procedure. Basic professional ethics would instead require him to write a DestroyCity procedure, to which Baghdad could be given as a parameter",
    name: "Nathaniel S. Borenstein"
  }, {
    quote: "I will not be a lemming and follow the crowd over the cliff and into the C",
    name: "John (Jack) Beidler"
  }, {
    quote: "C is quirky, flawed, and an enormous success",
    name: "Dennis MacAlistair Ritchie"
  }, {
    quote: "Fifty years of programming language research, and we end up with C++ ???",
    name: "Dr Richard A. O’Keefe. "
  }, {
    quote: "C++ is a horrible language. It's made more horrible by the fact that a lot of substandard programmers use it, to the point where it's much much easier to generate total and utter crap with it. Quite frankly, even if the choice of C were to do *nothing* but keep the C++ programmers out, that in itself would be a huge reason to use C",
    name: "Linus Benedict Torvalds"
  }, {
    quote: "In C++ it's harder to shoot yourself in the foot, but when you do, you blow off your whole leg.",
    name: "Bjarne Strousturp"
  }, ];

  // 

  $("#quotegen").click(function() {
    $("#quotebody").css({
      "display": "inline"
    });
    var j = Math.floor(Math.random() * backcolor.length);

    $("body").css({
      "backgroundColor": backcolor[j],
    });
    $(".fa-quote-left").css({
      "color": backcolor[j],
    });
    $(".text-success").css({
      "color": backcolor[j],
    });
    $("#quotegen").css({
      "color": backcolor[j],
    });

    var html1 = "",
      html2 = "";
    var i = Math.floor((Math.random() * quotes.length));

    html1 = "<p>\"" + quotes[i]["quote"] + "\"</p>";
    html2 = "<p>- " + quotes[i]["name"] + "</p>";

    $("#quotehere").html(html1);
    $("#quoteguy").html(html2);
    var twitext = "\"" + quotes[i]["quote"] + "\"-" + quotes[i]["name"];
    $("#twit").attr("href", "https://twitter.com/intent/tweet?text=" + twitext);

  });

});