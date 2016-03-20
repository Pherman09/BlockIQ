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
    console.log(parsed);
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

  params = "?get=" + population +
  "," + medianAge +
  "," + medianRent +
  "," + medianIncome +
  "," + totalInPoverty  +
  "," + totalVeterans +
  "," + totalHousingUnits +
  "," + totalRenterOccupied +
  "," + totalOwnerOccupied +
  ","+ totalOccupiedHousingUnites  +
  "," + totalInsured +
  "," + totalDoctors +
    "," + totalForeignBorn +
    "," + commuteCarpool +
    "," + commuteCarAlone +
    "," + commutePublicTransportation +
    ","+ commuteWalk +
    "," + commuteBike +
    "," + commuteWorkAtHome +
    "," + commuteOther + "&";
  geography = "for=tract:" + tract + "&in=state:" + state+ "+county:" + county;
  tractCall = httpCensus + params + geography + censusKey;
  console.log(tractCall);
  $.ajax({
    url: tractCall,
    crossDomain:true,
    success: function (data, textStatus, xhr) {
      console.log(data);
      censusBits = [];
      populationOb = createOb(0,"population",data[1][0],"people","Population Characteristics");
      medianAgeOb = createOb(1,"Median Age",data[1][1],"years","Population Characteristics");
      medianRentOb = createOb(2,"Median Rent",data[1][2],"dollars","Housing Characteristics");
      medianIncomeOb = createOb(3,"Median Income",data[1][3],"dollars","Financial Characteristics");
      totalInPovertyOb = createOb(4,"Population Below the Poverty Line",data[1][4],"people","Financial Characteristics");
      totalVeteransOb = createOb(5,"Number of Veterans",data[1][5],"people","Population Characteristics");
      totalHousingUnitsOb = createOb(6,"Total Number of Housing Units",data[1][6],"housing units","Housing Characteristics");
      totalRenterOccupiedOb =createOb(7,"Total Number of Renter Occupied Households",data[1][7],"housing units","Housing Characteristics");
      totalOwnerOccupiedOb = createOb(8,"Total Number of Owner Occupied Households",data[1][8],"housing units","Housing Characteristics");
      totalOccupiedHousingUnitesOb = createOb(9,"Total Number of Owner Occupied Households",data[1][9],"households","Housing Characteristics");
      totalInsuredOb = createOb(10,"Number of People with Insurance",data[1][10],"people","Financial Characteristics");
      totalDoctorsOb = createOb(11,"Number of People with PhDs",data[1][11],"people","Population Characteristics");
      totalForeignBornOb = createOb(12,"Foreign Born Population",data[1][12],"people","Population Characteristics");
      commuteCarpoolOb = createOb(13,"Number of People who Commute via Carpooling",data[1][13],"people","Transportation");
      commuteCarAloneOb = createOb(14,"Number of People who Commute by Driving Alone",data[1][14],"people","Transportation");
      commutePublicTransportationOb = createOb(15,"Number of People who Commute with Public Transportation",data[1][15],"people","Transportation");
      commuteWalknOb = createOb(16,"Number of People who Commute by Walking",data[1][16],"people","Transportation");
      commuteBikeOb = createOb(17,"Number of People who Commute by Biking",data[1][17],"people","Transportation");
      commuteWorkAtHome =createOb(18,"Number of People who don't commute because they work at home",data[1][18],"people","Transportation");
      commuteOther =createOb(19,"Number of People who Commute with Unidentified Method",data[1][19],"people","Transportation");
      console.log(censusBits);
  }
});
};




//Get Long and Lat from center of map, then call FCC Block Converter API
//On pressing enter in search bar
$('#AddressForm').keypress(function(e){
if(e.which == 13) {
  var query = $('#AddressForm').val();
    $.ajax({
      url: "http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=1&countrycodes=US&q="+query+" philadelphia pa",
    }).done(function(data) {
      var latitude = _.first(data).lat;
      var longitude = _.first(data).lon;
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
});


//Load Second Page on Click of function
$('#ToQuizSlide').click(function(){
  //If statement, give alert if geocoding failed
  $('#Scene1').hide();
  $('#Scene2').show();
});
