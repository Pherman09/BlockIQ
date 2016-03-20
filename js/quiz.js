
$("#button-next").hide();

var userAnswers = 0;
var Qanswers;
var even = 0;
var buttonsContainer = $('#buttons');



var setButtons = function(answers) {
buttonsContainer.empty();
$.each(answers, function(key, answer) {
  buttonsContainer.append('<button id="'+key+'" value="'+key+'">'+answer.value+'</button>');
});
Qanswers = answers;
};

$('#buttons').click(function(e){

for(i=0; i<Qanswers.length; i++){
  $('#' +i+ '').prop('disabled', true);
  even = even + Qanswers[i].correct*i;
}

if (Qanswers[e.target.value].correct){
  $("#"+e.target.value+"").css("background-color", "green");
    userAnswers = userAnswers + 1;
}

else {
      $('#'+even+'').css("background-color", "green");
      $("#"+e.target.value+"").css("background-color", "red");
}
$("#button-next").show();
console.log(userAnswers);
});

var setQuestion = function(question) {
$('#question').text(question);
};



var questions = [
{
  id: 1,
  question: "What is this thing?",
  answers: [
    {
      correct: true,
      value: 2000,
    },
    {
      correct: false,
      value: 3000,
    },
    {
      correct: false,
      value: 4000,
    },
    {
      correct: false,
      value: 5000,
    }
  ]
},
{
  id: 2,
  question: "What is this widget-a-ma-thing?",
  answers: [
    {
      correct: true,
      value: 2000,
    },
    {
      correct: false,
      value: 3000,
    },
    {
      correct: false,
      value: 4000,
    },
    {
      correct: false,
      value: 5000,
    }
  ]
},
{
  id: 3,
  question: "What is this the third?",
  answers: [
    {
      correct: true,
      value: 2000,
    },
    {
      correct: false,
      value: 3000,
    },
    {
      correct: false,
      value: 4000,
    },
    {
      correct: false,
      value: 5000,
    }
  ]
},
{
  id: 4,
  question: "Fourth question?",
  answers: [
    {
      correct: false,
      value: 20000,
    },
    {
      correct: false,
      value: 10000,
    },
    {
      correct: true,
      value: 4000,
    },
    {
      correct: false,
      value: 5700,
    }
  ]
},
{
  id: 5,
  question: "Fifth question?",
  answers: [
    {
      correct: false,
      value: 200000000,
    },
    {
      correct: false,
      value: 10000,
    },
    {
      correct: false,
      value: 4000000,
    },
    {
      correct: true,
      value: 5700,
    }
  ]
},
{
  id: 6,
  question: "You are a ",
}
];

setButtons(questions[0].answers);
setQuestion(questions[0].question);

var state=1;

$("#button-next").click(function(){
setButtons(questions[state].answers);
setQuestion(questions[state].question);
state++;
$("#button-next").hide();
// console.log(state);
if (state == 6){
  $("#cat").text(category[userAnswers].cat);
  $("#cat-numRight").text(category[userAnswers].numRight);
  // $("#image").empty().append('<img src= category[userAnswers].image height="25%" width="25%">');
  $("#cat-text").text(category[userAnswers].text);
}});

var category =[
{cat: "Tourist", numRight: "0/5 Answers Correct", text: "Pat's and Geno's might be in this neighborhood, but then again, you might just be lost.", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"},
{cat: "Regional Rail Rider", numRight: "1/5 Answers Correct", text: "You're here. Sometimes. You might be gone before 11 pm but you sure know how to get the most out of Septa.", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"},
{cat: "Stray Cat", numRight: "2/5 Answers Correct", text: "You're a rolling stone, you might say 'Hi' to your neighbords but you're still aloof.", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"},
{cat: "Mail Delivery Person", numRight: "3/5 Answers Correct", text: "You know all the neighborhood gossip, but you keep the who's-who's to yourself. Props.", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"},
{cat: "Block Captain", numRight: "4/5 Answers Correct", text: "You've got tons of pride in your neighborhood, you keep things in line, and theres a high chance you might say 'wudder'", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"},
{cat: "Mayor Kenney", numRight: "5/5 Answers Correct", text: "You know the city inside and out. At some point there will probably be a mural erected in your honor.", image: "https://c.stocksy.com/a/Ink200/z0/656536.jpg"}
];
