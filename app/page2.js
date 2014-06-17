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
window.onload = function(){
	//change contents based on the postNo - contents and language

	//update the postNo to pass to PHP through the hidden input
    document.getElementById("postNo").value = params.post;

    //retrieve the textfile with the post information
	var txtFile = new XMLHttpRequest();
	var filename = "post" + params.post + ".txt";
	txtFile.open("GET", filename, true);
	txtFile.onreadystatechange = function() {
	  if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
	    if (txtFile.status === 200) {  // Makes sure it's found the file.
			allText = txtFile.responseText; 
			lines = txtFile.responseText.split("\n"); // Will separate each line into an array
			
			//change the language mentioned in Q4 depending on language of the post
			document.getElementById("Q4").innerHTML = "4. Why did you write this post in " + lines[0] +"?";
			var input = $('#appropriate');
		    newText = lines[0] + " is more appropriate for expressing the content";
		    input[0].nextSibling.nodeValue = newText;
	    }
	  }
	}
	txtFile.send(null);


};



