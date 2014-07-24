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

window.onload = function(){
	//change contents based on the postNo - contents and language



    $.getJSON( "page2.json", function( data ) {

    	//read the json file and save all posts in items
  		var items = [];
	  	$.each( data, function( key, val ) {
	   	 items.push(val);
	  	});

	 console.log(items);

	 for (index = 0; index < items.length; ++index) {

		 currentPost = items[index];

		 currentLang = currentPost.lang;
		 document.getElementById("date" + index).innerHTML = currentPost.date;
		 document.getElementById("type" + index).innerHTML = currentPost.type;
		 document.getElementById("message" + index).innerHTML = currentPost.message;
		 if (currentPost.type == "Comment"){
		 	document.getElementById("box" + index).style.backgroundColor = "#F6F7F8";
		 } 

	    var originalDiv = document.getElementById("originalDiv" + index);
		 //hide original if Status
		 if (currentPost.type == "Status Update"){
		 	//document.getElementById("originalDiv").style.visibility = 'hidden';
	    	originalDiv.style.visibility = 'hidden';
	    	originalDiv.style.height = '0px';
		 } else{
	    	originalDiv.style.visibility = 'visible';
	    	originalDiv.style.height = '100px';
		 }
		 document.getElementById("original" + index).href = currentPost.original;
		}


	});
};


