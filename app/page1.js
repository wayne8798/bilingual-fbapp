var statusNo = 1;
var scenarios = ["first", 
"You just got the email notifying you <br>that you got your dream job.<br> Write a post about it.",
"You are conducting a survey on <br>best Asian restaurants in town. <br>Recruit people."];

var statusList = [];
function getStatus() {
    var status = document.getElementById("status").value;
    console.log(status);
    statusList.push(status +"\n");
    statusNo += 1;
	document.getElementById("status").value = ""
	document.getElementById("scenarioNo").innerHTML = "Scenario " + statusNo.toString();
	document.getElementById("scenario").innerHTML = scenarios[statusNo -1];
	document.getElementById("scenarioImage").src = "scenario" + statusNo.toString() + ".jpeg";

    if (statusList.length >= scenarios.length){
	 	if (status != null){
			$.ajax({
				type: 'POST',
				data: { 
				statusList: statusList
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

		location.href = "page2.html#post=1";
    }

}
