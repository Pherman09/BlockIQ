/* ================================
Week 7
================================ */

//Map Setup from Week4 Lab 2
var map = L.map('map', {
  center: [40.010454, -75.108772],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

var censusCall = "long lat empty";
var tractCall = "tract empty";
var FIPSCode = "No FIPS Code";

var CensusTract;

var removeCensusTract = function(CensusTract) {
      map.removeLayer(CensusTract);
    };

var CensusTractGeoJSON = function(FIPSCode){
  url = "https://raw.githubusercontent.com/yuchu/BlockIQ/master/Census_Tracts_2010.geojson";
  $.ajax(url).done(function(data){
    parsed= JSON.parse(data);
    CensusTract = L.geoJson(parsed, {
      filter: function(feature){
        return (feature.properties.GEOID10==FIPSCode.substring(0,11));
      }
    }).addTo(map);
    // console.log(FIPSCode,FIPSCode.substring(0,11));
  });
};

var marker = [];
var plotMarkers = function(marker){
      marker.addTo(map);
    };
var removeMarker = function(marker) {
      map.removeLayer(marker);
    };


//This Function
var createWrongAnswers = function(num){
  var arrayOfAnwers = [];
  var rando = Math.random();
  if (rando > 0.25 || rando < 0.5) {
    arrayOfAnwers.push(Math.round(num * 1.2));
    arrayOfAnwers.push(Math.round(num * 1.5));
    arrayOfAnwers.push(Math.round(num * 0.8));
  } else if (rando > 0.5 || rando < 0.75){
    arrayOfAnwers.push(Math.round(num * 0.8342));
    arrayOfAnwers.push(Math.round(num * 0.7656));
    arrayOfAnwers.push(Math.round(num * 0.965));
  } else if (rando > 0.75){
    arrayOfAnwers.push(Math.round(num * 0.6));
    arrayOfAnwers.push(Math.round(num * 0.8));
    arrayOfAnwers.push(Math.round(num * 1.3));
  } else {
    arrayOfAnwers.push(Math.round(num * 1.4));
    arrayOfAnwers.push(Math.round(num * 0.74));
    arrayOfAnwers.push(Math.round(num * 1.1));
  }
  return arrayOfAnwers;
};

var createOb = function(id,subject,value,unit,catagory){
   var valCensus = Number(value);
  censusBits.push ({
    "id":id,
    "subject":subject,
    "value": valCensus,
    "unit": unit,
    "catagory":catagory,
    "wronganswers":createWrongAnswers(valCensus)
  });
};

var processFIPSCode = function(FIPSCode) {
  var state = FIPSCode.substring(0,2);
  var county = FIPSCode.substring(2,5);
  var tract = FIPSCode.substring(5,11);
  var block = FIPSCode.substring(11,15);
  FIPStoinfo(state,county,tract);
};


var censusBits2 =[];

var FIPStoinfo = function(state,county,tract){
  httpCensus = "http://api.census.gov/data/2014/acs5";
  censusKey = "&key=ccda5ba8300d0a723e4cba2a1a0e7cf9b2768b46";
  population = "B01003_001E";
  medianAge = "B01002_001E";
  medianRent = "B25058_001E";
  medianIncome = "B06011_001E";
  medianHouseValue = "DP04_0088E"; //Name
  totalInPoverty = "B07012_002E";
  totalVeterans = "B21001_002E";
  totalHousingUnits = "B25001_001E";
  totalRenterOccupied = "B25003_003E";
  totalOwnerOccupied = "B25003_002E";
  totalOccupiedHousingUnites = "B25003_001E";
  totalInsured = "B27001_001E";
  totalVacentUnits = "DP04_0003E"; //Name
  totalNonEnglishSpeakers = "C06007_003E"; //??
  totalBachelors = "DP02_0064M"; //Name
  totalDoctors = "B15003_025E";
  totalForeignBorn = "B05006_001E";
  commuteCarpool= "B08006_004E";
  commuteCarAlone = "B08006_003E";
  commutePublicTransportation = "B08006_008E";
  commuteWalk = "B08006_015E";
  commuteBike = "B08006_014E";
  commuteWorkAtHome = "B08006_017E";
  commuteOther = "B08006_016E";

  params = "?get=" + totalDoctors +
  "," + medianRent +
  "," + commutePublicTransportation +
  "," + totalForeignBorn +
  "," + totalVeterans + "&";
  geography = "for=tract:" + tract + "&in=state:" + state+ "+county:" + county;
  tractCall = httpCensus + params + geography + censusKey;
  $.ajax({
    url: tractCall,
    crossDomain:true,
    success: function (data, textStatus, xhr) {
      censusBits = [];
      totalDoctorsOb = createOb(0,"How many people in your neighborhood hold a doctorate degree?",data[1][0],"people","Population Characteristics");
      medianRentOb = createOb(1,"Which of these choices is the median rent in your neighborhood?",data[1][1],"dollars","Housing Characteristics");
      commutePublicTransportationOb = createOb(2,"How many people in your neighborhood take public transit to work?",data[1][2],"people","Transportation");
      totalForeignBornOb = createOb(3,"How many people in your neighborhood are foreign-born?",data[1][3],"people","Population Characteristics");
      VeteransOb = createOb(4,"How many people in your neighborhood are veterans?",data[1][4],"people","Population Characteristics");
      console.log(censusBits);
      censusBits2 = censusBits;
      console.log(censusBits2);
  }
});
};

//Get Long and Lat from center of map, then call FCC Block Converter API
//On pressing enter in search bar
$('#AddressForm').keypress(function(e){
if(e.which == 13) {
  $('#Scene2').show();
  $('#Scene1').hide();
  var query = $('#AddressForm').val();
    $.ajax({
      url: "http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=1&countrycodes=US&q="+query+" philadelphia pa",
    }).done(function(data) {
      var latitude = _.first(data).lat;
      var longitude = _.first(data).lon;
      map.setView([latitude,longitude],13);
      marker = L.marker([latitude, longitude]);
      plotMarkers(marker);
    censusCall = "https://data.fcc.gov/api/block/find?format=jsonp&latitude=" + latitude +"&longitude="+ longitude + "&showall=false";
    $.ajax({
      url: censusCall,
      type: 'GET',
      dataType: 'jsonp',
      crossDomain:true,
      success: function (data, textStatus, xhr) {
      FIPSCode = data.Block.FIPS;
      $("#CensusNum").text(FIPSCode.substring(5,11)
    );
      processFIPSCode(FIPSCode);
      CensusTractGeoJSON(FIPSCode);
      // plotCensusTract();
      if(typeof CensusTract !== 'undefined'){
        removeCensusTract(CensusTract);
      }
      }
    });
  });
}});

//Load first page
$(document).ready(function(){
  $('#Scene1').show();
  $('#Scene2').hide();
  $('#Scene3').hide();
});


//Load Second Page on Click of function
$('#ToQuizSlide').click(function(){
  //If statement, give alert if geocoding failed
  $('#Scene2').hide();
  $('#Scene3').show();
  $('#button-next').hide();
  var buttonsContainer = $('#buttons');
  var userAnswers = 0;
  var Qanswers;

  var setButtons = function(answers) {
    buttonsContainer.empty();
    $.each(answers, function(key, answer) {
      buttonsContainer.append('<button id="'+key+'" value="'+key+'">'+answer.value+'</button>');
    });
    Qanswers = answers;
  };

  $('#buttons').click(function(e){
    var even =0;
    for (i=0; i<Qanswers.length; i++){
      $('#'+i+'').prop('disabled',true);
      even = even + Qanswers[i].correct*i;
    }
    // _.map(Qanswers, function(num){ $('#'+num+'').prop('disabled',true); });
    // var even = _.find([0, 1, 2, 3], function(num){ return Qanswers[num].correct==1;});
    if(Qanswers[e.target.value].correct){
      $('#'+e.target.value+'').css("background-color","green");
      userAnswers = userAnswers + 1;
    }
    else {
      $('#'+even+'').css("background-color","green");
      $('#'+e.target.value+'').css("background-color","red");
    }
    $('#button-next').show();
  });

  var setQuestion = function(question) {
    $('#question').text(question);
  };

  var generateAnswers = function(obj) {
    var answers = [];
    var correctIndex = _.random(0, 3);
    for (var i = 0; i < 4; i++) {
      if (i === correctIndex) {
        answers.push({
          correct: 1,
          value: obj.value,
        });
      }
      else {
        var wrong = obj.wronganswers.pop();
        answers.push({
          correct: 0,
          value: wrong,
        });
      }
    }
    return answers;
  };

  var questions =[];
  _.each(censusBits2,function(obj){
    var question = {
      id: obj.id,
      question: obj.subject,
      answers: generateAnswers(obj)
    };
    questions.push(question);
  });

  var finalpage = {
    id:6,
    question: ""
  };

  questions.push(finalpage);

  setButtons(questions[0].answers);
  setQuestion(questions[0].question);
  var state_q=1;
  $("#count").text('1/5');
  $('#button-next').click(function(){
    setButtons(questions[state_q].answers);
    setQuestion(questions[state_q].question);
    state_q++;
    $("#count").text(''+state_q+'/5');
    $('#button-next').hide();
    if (state_q == 6){
      $("#count").text('Result');
      $("#cat").text(category[userAnswers].cat);
      $("#cat-numRight").text(category[userAnswers].numRight);
      $("#image").empty().append('<img src= ' + category[userAnswers].image + ' height="25%" width="25%">');
      $("#cat-text").text(category[userAnswers].text);
    }
  });
  var category =[
  {cat: "Tourist", numRight: "0/5 Answers Correct", text: "Pat's and Geno's might be in this neighborhood, but then again, you might just be lost.", image: "images/tourist.jpg"},
  {cat: "Regional Rail Rider", numRight: "1/5 Answers Correct", text: "You're here. Sometimes. You might be gone before 11 pm but you sure know how to get the most out of Septa.", image: "images/train.jpg"},
  {cat: "Stray Cat", numRight: "2/5 Answers Correct", text: "You're a rolling stone, you might say 'Hi' to your neighbords but you're still aloof.", image: "images/cat.jpg"},
  {cat: "Mail Delivery Person", numRight: "3/5 Answers Correct", text: "You know all the neighborhood gossip, but you keep the who's-who's to yourself. Props.", image: "images/mail.jpg"},
  {cat: "Block Captain", numRight: "4/5 Answers Correct", text: "You've got tons of pride in your neighborhood, you keep things in line, and theres a high chance you might say 'wudder'", image: "images/blockcaptain.jpg"},
  {cat: "Mayor Kenney", numRight: "5/5 Answers Correct", text: "You know the city inside and out. At some point there will probably be a mural erected in your honor.", image: "images/mayor.jpg"}
  ];
});
