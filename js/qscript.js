// stops error message in firefox when not using server (i.e. in dev) otherwise not needed. 
$.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType)
    {
	xhr.overrideMimeType("application/json");
    }
}
	    });


// setup ajax
$.ajaxSetup ({  
   cache: false  
    });   
//
units = ["unit0","unit1"];
num_of_stars = 5;
unitsdata = {}
unitsstats = {}
questions = [];
currentq = {};
qanswered = false;
tablecreated = false;
// hacky way of avoiding weird bug where document.click fires when created with another click
falseclick = 0;
// so we can remove the blinking code when not in use
example = false;

var currentex;
var currentexnum;
var currentunit;
var initPage = function () {
    for (i = 0; i<units.length; i++) {
	unitname = units[i]
	unitsdata[unitname] = "loading";
	loadUnit(unitname)
  	makeunitdiv(unitname)
    } 
    sqldata = {}
    sqldata["uid"]=uid;
    $.post("getstats.php",sqldata,statsLoaded);    
    
};
var statsLoaded = function (statdata) {
    $.each(statdata,function(unit,exercises) {
	$.each(exercises,function(exnum,exercise){
	    thisexercise = {}
	    if (!(unit in unitsstats)) {
    		unitsstats[unit] = {}
	    }
	    thisexercise['locked']= parseInt(exercise['locked']);
	    thisexercise['numcorrect'] = parseInt(exercise['numcorrect']);
	    thisexercise['numanswered'] = parseInt(exercise['numanswers']);
	    thisexercise['beststreak'] = parseInt(exercise['beststreak']);
	    thisexercise['currentstreak'] = parseInt (exercise['currentstreak']);
	    unitsstats[unit][exnum] = thisexercise;

	});
	updateunitdiv(unit);
		     
    });
   
}

var loadUnit = function(unitname) {
    $.getJSON( "questions/"+unitname+".json", function( data ) {
	unitsdata[unitname] = data;
	makeunitstats(unitname)
	updateunitdiv(unitname);
    });
};

// make empty divs for the units on creation
var makeunitdiv = function (unit) {
    divstring = "<div id='"+unit+"'class='unitdiv'><div id='title_"+unit+"'><h2>"+unit+"</h2></div></div>";
    $('#main').append(divstring);	
};

//make empty stats for the unit on creation
var makeunitstats = function (unit) {
   
    exerciseexists = false;
    if (!(unit in unitsstats)) {
	unitsstats[unit] = {}
    }
    
    $.each(unitsdata[unit]["exercises"],function(key,exercise) {
	if (!(key in unitsstats[unit])) {
	    exstats = {};
	    if (key == "0") {
		exstats["locked"]=false;
	    }
	    else {
		exstats["locked"]=true;
	    }
	    exstats["numanswered"] = 0;
	    exstats["numcorrect"] = 0;
	    exstats["beststreak"] = 0;
	    exstats["currentstreak"]=0;
	    unitsstats[unit][key]=exstats;
	}
    });
    
}

//update the unit divs after the json has loaded
var updateunitdiv = function (unit) {
    divstring = "<div id='title_"+unit+"'><h2>"+unitsdata[unit]["id"]+"</h2></div></div>";
  //  $("#title_"+unit).html("<h2>"+unitsdata[unit]["id"]+"</h2>");
    
    $.each(unitsdata[unit]["exercises"],function(key,exercise) {
	divstring = divstring + "<div id='"+unit+"_"+key+"' class='exercise' onclick='checklock(\""+unit+"\",\""+key+"\")'><h3 class='exercise_name'>Exercise "+key+"</h3>"


	/// lock
	if (unitsstats[unit][key]["locked"]==true) {
	    divstring = divstring + "<div id ='"+unit+"_"+key+"lock' class='lock'><img src='./img/locked.png' alt='locked'></div>"
	} else {
	 
	    if (parseInt(unitsstats[unit][key]["beststreak"]) >= 5) {
		divstring = divstring + "<div id ='"+unit+"_"+key+"bronze' class='medal'><img src='./img/bronzemedal.png' width='81px' height='150px' alt='bronzemedal'></div>"

	    }
	    
	    divstring = divstring + "<div id = 'numanswered' class = 'stats'>Number of Questions Answered: "+unitsstats[unit][key]["numanswered"]+"</div>";
	    divstring = divstring + "<div id = 'numcorrect' class = 'stats'>Number of Correct Answers: "+unitsstats[unit][key]["numcorrect"]+"</div>";

	    percent = 0;
	    if (unitsstats[unit][key]["numanswered"] > 0) {
		percent = (unitsstats[unit][key]["numcorrect"]/unitsstats[unit][key]["numanswered"])*100
	    }
	    percent = Math.round(percent);
	    divstring = divstring + "<div id = 'percentcorrect' class = 'stats'>Percentage of Correct Answers: "+percent+"%</div>";

	    
	    divstring = divstring + "<div id = 'beststreak' class = 'stats'>Best Streak: "+unitsstats[unit][key]["beststreak"]+"</div>";
	    divstring = divstring + "<div id = 'currentstreak' class = 'stats'>Current Streak: "+unitsstats[unit][key]["currentstreak"]+"</div>";
    
	}
	
	
	
	
	divstring = divstring + "</div>"
    });
    $("#"+unit).html(divstring);	

};

var blinkExampleText = function() {
    $('#exampleprompt').fadeOut(500).fadeIn(500,function() {
	if (example == true) {
	    blinkExampleText();
	}
    });

}


//return to the main menu
var mainmenu = function() {
    // should save data here
    
    updateunitdiv(currentunit);
    $('#questionbox').fadeOut(400,function(){
	$('#questionbox').remove();
	$(".unitdiv").fadeIn(400)
    });
    $('#levelup').fadeOut(400,function(){
	$('#levelup').remove();
    });
 
    
}
var checklock = function (unit,ex) {
    if (unitsstats[unit][ex]["locked"] == false) {
	enterquiz(unit,ex);
    } else
    {
	showlocked();
//	window.alert("This Exercise is locked!")
    }

}



//go to an exercise page from the main menu
var enterquiz = function (unit,ex) {
    /// remove locked message if present
    endlocked();
    initquestions(unit,ex);
    currentex = unitsdata[unit]["exercises"][ex];
    divstring = "";
  //  var wth =  "Exerc;lkj;ljise "+ex;
    divstring = divstring + "<div id='questionbox' style='display: none'><h2>"+unitsdata[unit]["id"]+" - Exercise "+ex+" :</h2>";
   // divstring = divstring + "<div id='questionbox' style='display: none'><h2>"+unitsdata[unit]["id"]+" - "+wth+" :</h2>";
  
    divstring = divstring + "<div id='description'>"+currentex["question_prompt"]+"</div>";
    //divstring = divstring + "<div id='help' class='button' onclick='showhelp()'>Help</div>"
    divstring = divstring + "<div id='help' class='button'>Help</div>"
    divstring = divstring + "<div id='mainmenu' class='button' onclick='mainmenu()'>Main menu</div>"
    divstring = divstring + "<div id='spacer'></div>"
    divstring = divstring + "<div id='spacer2'> </div>";
    /// stars
    divstring = divstring + "<div id='starbox'>";
    divstring = divstring + "<div id='star1' class='star'><img src='./img/starGrey.png' alt='nostar'></div>"
    divstring = divstring + "<div id='star2' class='star'><img src='./img/starGrey.png' alt='nostar'></div>"
    divstring = divstring + "<div id='star3' class='star'><img src='./img/starGrey.png' alt='nostar'></div>"
    divstring = divstring + "<div id='star4' class='star'><img src='./img/starGrey.png' alt='nostar'></div>"
    divstring = divstring + "<div id='star5' class='star'><img src='./img/starGrey.png' alt='nostar'></div>"
    divstring = divstring + "</div>"


    
    divstring = divstring + "<div id='question'>";
    divstring = divstring + "<div id='questionq'><h3>"+currentex["example"]["question"]+"</h3></div>";
    divstring = divstring + "<div id='qdivider'></div>"
    divstring = divstring + "<div id='questiona'><div id='questionainner'>"+currentex["example"]["answer"]+"</div></div>";
    divstring = divstring + "</div>"
    divstring = divstring + "<div id='nextbutton' class='button'>Start</div>"
    divstring = divstring + "</div>"

//    exampleprompt.
    divstring2 = "<div id='exampleprompt'>EXAMPLE</div>"
    $('.unitdiv').fadeOut(400,function(){
	if ($('#questionbox').length == 0) {
	    $("#main").append(divstring);
	    $("#help").click(showhelp);
	    $("body").append(divstring2);
	    example=true;
	    blinkExampleText();
	    $('#nextbutton').click(function () {nextbuttonpressed()});
	    $("#questionbox").fadeIn(400)
	}
    });
  updatestars(unit,ex);
}
var nextbuttonpressed = function () {
    if (example == true) {
	startquiz()
    }
    else {
	submitanswer();
    }
}

var updatestars = function (unit,ex) {
    currstats = unitsstats[unit][ex];
    for (i = 0;i<num_of_stars;i++) {
	thisstar = "#star"+(num_of_stars-i)
	
	if (currstats["currentstreak"]>i) {
	    $(thisstar).html("<img src='./img/starGold.png' alt='star'>")
	} else {
	    $(thisstar).html("<img src='./img/starGrey.png' alt='nostar'>")
	}
	
    }
}


// create question array and shuffle
var initquestions = function (unit,ex) {
    currentexnum = ex;
    currentunit = unit;
    questions = [];
    tmp = unitsdata[unit]["exercises"][ex]["questions"];
    for (i = 0; i<tmp.length; i++){
	questions.push(tmp[i]);

    }
    shuffleqs();    
}
// shuffle the questions
var shuffleqs = function () {
  var i = 0
    , j = 0
    , temp = null

  for (i = questions.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = questions[i]
    questions[i] = questions[j]
    questions[j] = temp
  }
}

var startquiz = function () {
//    $('#nextbutton').remove();
    

  //  divstring = "<div id='nextbutton' class='button'>Next Questions</div>"
  //  divstring = divstring + "</div>"
  //  $("#main").append(divstring);
  // //$('#nextbutton').unbind();
    
   // $('#nextbutton').click(function () {submitanswer()});
    //$('#nextbutton').bind("touchstart",function () {submitanswer()});
    $('#nextbutton').html("Submit Answer");
   // $('#spacer').html("&nbsp");
    $('#exampleprompt').remove();
    example = false;
    qanswered = false;
    nextquestion()
}
var submitanswer = function () {
    if (qanswered == false) {
    
	
	answer = $('#questionainner').text();
	answer = sanitiseanswer(answer);
	correct = false;
	
	correctanswers = questions[questions.length-1]["a"];
	correctanswers = correctanswers.split("/");

	for (i = 0; i < correctanswers.length; i++) {
	    correctanswer = sanitiseanswer(correctanswers[i]);

	    
	    if (answer == correctanswer) {
		correct = true;
	    }
	}
	if (correct == true) {
	    updatestats(currentunit,currentexnum,true)
	    correctans();
	} else {
	   // window.alert("asdfas");
	    updatestats(currentunit,currentexnum,false)
   	    incorrectans(correctanswers[0]);
	}
	qanswered = true;	
    }
}
var correctans = function () {
    divstring = "<div id='correctbox' onClick=''>"
    divstring = divstring + "CORRECT</div>"
    $("body").append(divstring);
    $("#correctbox").animate({fontSize:'10em'},"slow",function() {endcorrect()})
}
var incorrectans = function (correctans) {
    divstring = "<div id='correctbox' onClick=''>";
    divstring = divstring + "WRONG!</div>";
    $("body").append(divstring);
    $("#correctbox").animate({fontSize:'10em'},"slow",function() {showanswer(correctans)});
    
}



var showanswer = function (ans) {
divstring = "<div id='showanswer' onClick ='endcorrect()'>The answer should have been: <br><h3>"+ans+"</h3><br>Continue...<br></div>"
    $("body").append(divstring);

}
var showlocked = function () {
    $('#showlocked').remove();
divstring = "<div id='showlocked' class='message' onClick ='endlocked()' ><h3>This exercise is locked</h3></div>"
    $("body").append(divstring);

}
var endlocked = function() {
    $("#showlocked").fadeOut("slow",function() {$('#showlocked').remove();})
}

var endcorrect = function () {
    $("#correctbox").fadeOut("slow",function() {$('#correctbox').remove();})
    $("#showanswer").fadeOut("slow",function() {$('#showanswer').remove();})
    moveToNextQ();
}
var moveToNextQ = function () {
    questions.pop();
    updatestars(currentunit,currentexnum);
    qanswered = false;
    nextex = (parseInt(currentexnum)+1).toString();
    if (currentstats["currentstreak"] == 5) {
	  if (unitsstats[currentunit][nextex]["locked"] == true) {
	      unitsstats[currentunit][nextex]["locked"] = false;
	      unlocknextsql(nextex);
	      levelup(nextex);
	    }
    } else {
    
    nextquestion();
    }
}

var updatestats = function (unit,ex,result) {
    currentstats = unitsstats[unit][ex];
  
    if (result == true) {
	currentstats["numcorrect"] = currentstats["numcorrect"]+1;
	currentstats["currentstreak"]=	currentstats["currentstreak"]+1;
	if (currentstats["currentstreak"] > currentstats["beststreak"]) {
	    currentstats["beststreak"] = currentstats["currentstreak"];
	}
//	if (currentstats["currentstreak"] == 5) {
//	    if (unitsstats[unit][nextex]["locked"] == true) {
//		unitsstats[unit][nextex]["locked"] = false;
//	    }
//	}
	
    } else {
	currentstats["currentstreak"]=0;
    }
    currentstats["numanswered"] = currentstats["numanswered"] +1;
    updatesql();
}

var levelup = function (nextex) {

    divstring = "<div id='levelup'>You have unlocked the next level.<br>"
    divstring = divstring + "<div id='nextlevel' class='option' onclick='changelevel(\""+nextex+"\")'> Move to the next level </div>"
    divstring = divstring + "<div id='continuelevel' class='option' onclick='continuelevel()'> Continue on this level </div>"
    divstring = divstring + "<div id='returntomenu' class='option' onclick='mainmenu()'> Return to the Main Menu </div>"
    $("body").append(divstring);
  
}

var continuelevel = function () {
    $('#levelup').fadeOut(400,function(){
	$('#levelup').remove();
	    nextquestion();

    });

}
var changelevel = function (newex) {
    $('#levelup').fadeOut(400,function(){
	$('#levelup').remove();
    });
    $('#questionbox').fadeOut(400,function(){
	$('#questionbox').remove();
	enterquiz(currentunit,newex);

    });


}



// function to strip trailing or leading whitespace
// strip space between the last word and the punctuation
// ignore capital letters
var sanitiseanswer = function (answer) {
    // remove whitespace
    newanswer = answer.trim()
    // make all lowercase
    newanswer = newanswer.toLowerCase();
    // strip space between last word and punctuation. (if there is any) 
    lastchar = newanswer[newanswer.length-1]
    newanswer = newanswer.slice(0,-1)
    newanswer = newanswer.trim()
    newanswer = newanswer + lastchar;

    
    return newanswer
}
var nextquestion = function () {
    $('#questionq').html("<h3>"+questions[questions.length-1]["q"]+"</h3>");
    $('#questiona').html("<div id='questionainner' contenteditable>&nbsp</div>");
    $('#questionainner').focus();
}

var showhelp = function () {
//    $(document).bind("click",function() {endhelp()    });
    $(document).click(function() {
	if (falseclick > 0)
	{
	    endhelp()    }
	else {
	    falseclick = falseclick + 1;
	}
    });

    divstring = "<div id='showhelp'><h3>"
    divstring = divstring+unitsdata[currentunit]["exercises"][currentexnum]["question_prompt"] +"</h3><br>"
    divstring = divstring+unitsdata[currentunit]["exercises"][currentexnum]["help"]+"</div>"
    $("body").append(divstring);
      
}

var endhelp = function () {
    $(document).unbind();
    falseclick = 0;
    $("#showhelp").fadeOut("slow",function() {$('#showhelp').remove();})
}


var updatesql = function () {
    data = unitsstats[currentunit][currentexnum];
    sqldata = {};
    sqldata["unit"]=currentunit;
    sqldata["ex"]=currentexnum;
    sqldata["uid"]=JSON.stringify(uid);
    sqldata["name"]=student_name;
    sqldata["studentnum"]=JSON.stringify(student_number);
   sqldata["locked"] = JSON.stringify(data["locked"]);
   sqldata["numanswered"] = JSON.stringify(data["numanswered"]);
   sqldata["numcorrect"] = JSON.stringify(data["numcorrect"]);
   sqldata["beststreak"] = JSON.stringify(data["beststreak"]);
   sqldata["currentstreak"] = JSON.stringify(data["currentstreak"]);
 //  sqldata["uid"] = JSON.stringify(data["uid"]);
  //  sqldata["studentnum"] = JSON.stringify(data["studentnum"]);
    
   $.post("update.php",sqldata);
}

var unlocknextsql= function (nextex){
data = unitsstats[currentunit][nextex]
    sqldata = {}
    sqldata["unit"]=currentunit;
    sqldata["ex"]=nextex;
    sqldata["uid"]=JSON.stringify(uid);
    sqldata["name"]=student_name;
    sqldata["studentnum"]=JSON.stringify(student_number);

   sqldata["locked"] = JSON.stringify(data["locked"]);
   sqldata["numanswered"] = JSON.stringify(data["numanswered"]);
   sqldata["numcorrect"] = JSON.stringify(data["numcorrect"]);
   sqldata["beststreak"] = JSON.stringify(data["beststreak"]);
//   sqldata["currentstreak"] = JSON.stringify(data["currentstreak"]);
//   sqldata["uid"] = JSON.stringify(data["uid"]);
//   sqldata["studentnum"] = JSON.stringify(data["studentnum"]);
    $.post("update.php",sqldata);    
};
	      

initPage()
