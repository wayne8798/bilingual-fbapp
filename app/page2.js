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

function audienceQ(answer){

	var remAudience = document.getElementById('rememberAudience');
	if (answer == 1){
	 	remAudience.style.visibility = 'visible';
	 	remAudience.style.height = '150px';
 	}else{
	 	remAudience.style.visibility = 'hidden';
	 	remAudience.style.height = '0px';
 	}
}

function updateSlider(questionNo, slideAmount) {
	var currentValue = document.getElementById("currentValueQ" + questionNo);
	currentValue.innerHTML= slideAmount;
}

params = analyse(window.location.hash);
window.onload = function(){
	//change contents based on the postNo - contents and language

	//update the postNo to pass to PHP through the hidden input
    document.getElementById("postNo").value = params.post;


    $.getJSON( "page2.json", function( data ) {

    	//read the json file and save all posts in items
  		var items = [];
	  	$.each( data, function( key, val ) {
	   	 items.push(val);
	  	});


	 currentPost = items[params.post-1];

	 currentLang = currentPost.lang;
	 document.getElementById("date").innerHTML = currentPost.date;
	 document.getElementById("type").innerHTML = currentPost.type;
	 document.getElementById("message").innerHTML = currentPost.message;
	 if (currentPost.type == "Comment"){
	 	document.getElementById("box").style.backgroundColor = "#F6F7F8";
	 }
	 document.getElementById("original").href = currentPost.original;

	 console.log(currentPost.date);
    //update the post
	//change the language mentioned in Q4 depending on language of the post


		if (currentLang.indexOf("Korean") > -1){
			document.getElementById("Q4").innerHTML = "4. Why did you write this post in Korean?";
			var appropriate = $('#reasonAppropriate');
		    appropriate[0].nextSibling.nodeValue = "Korean is more appropriate for expressing the content";

			var know = $('#reasonKnow');
		    newText = "Didn't know the terms/appropriate expression in English";
		    know[0].nextSibling.nodeValue = newText;

	    	var translateQ = document.getElementById("translate");
	    	translateQ.style.visibility = 'visible';
	    	translateQ.style.height = '80px';

	    	var audienceText = document.getElementById("Q3c").innerHTML;
	    	var newText = audienceText.replace("English", "Korean");
	    	document.getElementById("Q3c").innerHTML = newText;

	    } else if (currentLang.indexOf("Both") > -1){
	    	document.getElementById("Q4").innerHTML = "4a. Why did you write part of this post in English?";
	    	var bothLang = document.getElementById("bothLang");
	    	bothLang.style.visibility = 'visible';
	    	bothLang.style.height = '170px';

	    	var translateQ = document.getElementById("translate");
	    	translateQ.style.visibility = 'visible';
	    	translateQ.style.height = '80px';

	    	var audienceText = document.getElementById("Q3c").innerHTML;
	    	var newText = audienceText.replace("English", "both languages");
	    	document.getElementById("Q3c").innerHTML = newText;
		}

	});
};


