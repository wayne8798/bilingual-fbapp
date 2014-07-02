var statusNo = 1;
var scenarios = ["first", 
"You just got the email notifying you <br>that you got your dream job.<br> Write a post about it.",
"You are conducting a survey on <br>best Asian restaurants in town. <br>Recruit people."];

var scenariosKor = ["첫번째 한국 포스트 입니다", 
"두번째 라인세번.",
"세번째도 쓰세."];

var scenariosChi = ["chinese", 
"2nd Chinese post.",
"3rd Chinese post."];



analyse = function(url) {
  var paramstring, res;
  paramstring = url.substring(1);
  params = paramstring.split('&');
  res = {};
  params.forEach(function(item, index, array) {
    var splits;
    splits = item.split('=');
    return res[splits[0]] = splits[1];
  });
  return res;
};

params = analyse(window.location.hash);
var L1 = params.lang;
var refcode = params.refcode;
console.log(L1);

function changeLang() {

if (L1.indexOf("Korean") > -1)
	document.getElementById("scenarioL1").innerHTML = scenariosKor[statusNo -1];
else
	document.getElementById("scenarioL1").innerHTML = scenariosChi[statusNo -1];
}

function getStatus() {
    var status = document.getElementById("status").value + "\n";
    statusNo += 1;
	document.getElementById("status").value = ""
	document.getElementById("scenarioNo").innerHTML = "Scenario " + statusNo.toString();
	document.getElementById("scenario").innerHTML = scenarios[statusNo -1];

	if (L1.indexOf("Korean") > -1)
		document.getElementById("scenarioL1").innerHTML = scenariosKor[statusNo -1];
	else
		document.getElementById("scenarioL1").innerHTML = scenariosChi[statusNo -1];

	document.getElementById("scenarioImage").src = "scenario" + statusNo.toString() + ".jpeg";

 	if (status != null){
		$.ajax({
			type: 'POST',
			data: { 
			statusList: status,
			refcode: refcode
		},
		url: 'page1.php',
		dataType: 'json',
		async: false,

		success: function(result){
		// call the function that handles the response/results
		},

		error: function(){
		window.alert("Error");
		}
		});

		} else {
			alert('no statuslist');
		}

		console.log(statusNo);

    if (statusNo > scenarios.length){

		location.href = "page2.html#post=1";
    }

}
