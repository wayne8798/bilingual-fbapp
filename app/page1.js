var statusNo = 0;
var scenarios = ["Sample Scenario","Today is Chinese/Korean New Year. <br>Write a post to greet your friends on Facebook", 
"You went over to your friend’s house and really enjoyed the homemade food.<br> Write a post that would go along with this picture.",
"You just got assigned to a final project team for a course.<br> Write a post to plan a team meeting this Saturday at 2pm.",
"Your professor sang ‘Let it Go’ in the middle of a class today.<br> Write a post about it.",
"You are graduating, and you want to sell your car<br>(Ford Fusion, 2009, blue, 35000 miles) for $10,000.<br> Write a post to advertise it.",
"Today is Christmas.<br> Write a post to greet your friends on Facebook.",
"You just got back from your 3 days trip to New York.<br> Write a post describing the photos that you took <br>(Statue of Liberty, Wall Street Charging Bull, Times Square).",
"Yesterday was your birthday and lots of people posted greetings on your wall.<br> Write a post to thank everyone."];

var scenariosKor = ["오늘 해변가에 놀러갔는데 날씨도 좋고 기분 완전 좋음 ^0^<br> 학교에서 멀지만 않으면 더 자주 갈텐데...","오늘은 설날(구정)입니다. <br>페이스북 친구들을 위한 새해인사 글을 페이스북에 포스팅해보세요.", 
"당신은 친구집에 저녁 초대를 받았고 친구가 만든 음식은 정말로 맛있었습니다. <br>음식사진과 함께 페이스북에 올릴 글을 포스팅해보세요.",
"당신은 방금 기말 과제팀에 배정 받았습니다. <br>이번주 토요일 오후 2시에 팀회의 하자는 글을 페이스북에 포스팅해보세요.",
"오늘 교수님이 수업시간 도중에 ‘Let it Go’를 부르셨습니다.<br> 이에 대한 글을 페이스북에 포스팅해보세요.",
"당신은 이제 졸업하게 되어 자동차 (Ford Fusion, 2009, 남색, 35000 마일) 를 팔려고 합니다.<br> 페이스북에 광고하는 글을 포스팅해보세요.",
"오늘은 크리스마스입니다.<br> 페이스북 친구들을 위한 글을 포스팅해주세요.",
"당신은 방금 뉴욕 2박3일 여행에서 돌아왔습니다.<br> 아래의 사진들과 함께 올릴만한 글을 포스팅해주세요 (자유의 여신상, 월스트릿 황소동상, 타임스 스퀘어).",
"어제는 당신의 생일이였습니다.<br> 생일 축하글을 남긴 많은 사람들을 위한 감사글을 포스팅해주세요."];

var scenariosChi = ["Sample chinese post","1st chinese", 
"2nd Chinese post.",
"3rd Chinese post.",
"4th Chinese post.",
"5th Chinese post.",
"6th Chinese post.",
"7th Chinese post.",
"8th Chinese post."];



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
	document.getElementById("scenarioL1").innerHTML = scenariosKor[statusNo];
else
	document.getElementById("scenarioL1").innerHTML = scenariosChi[statusNo ];
}

function getStatus() {
    var status = document.getElementById("status").value + "\n";
    statusNo += 1;
	document.getElementById("status").value = ""
	document.getElementById("scenarioNo").innerHTML = "Scenario " + statusNo.toString();
	document.getElementById("scenario").innerHTML = scenarios[statusNo] ;

	if (L1.indexOf("Korean") > -1)
		document.getElementById("scenarioL1").innerHTML = scenariosKor[statusNo];
	else
		document.getElementById("scenarioL1").innerHTML = scenariosChi[statusNo];

	document.getElementById("scenarioImage").src = "../pics/scenario" + statusNo.toString() + ".jpeg";

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

    if (statusNo >= scenarios.length){

		location.href = "page2.html#post=1";
    }

}
