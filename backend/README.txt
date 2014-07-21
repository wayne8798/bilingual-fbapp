Directions:
1. open the comments page in Facebook, scroll all the way down and save the page as "comment.html".
window.setInterval(function() { window.scroll(0,document.body.offsetHeight); } , 1000);

2. open FQL explorer (https://developers.facebook.com/tools/explorer).
3. click on "Get Access Token" and ask for the "user_status" and "read_stream" permissions.
4. use "SELECT owner_comment, title, created_time, link_id, url from link WHERE owner = me() and owner_comment <> "";" to get shares data.
5. save the share data in "share.json".
6. use "SELECT status_id, time, message FROM status WHERE uid = me() and message <>"";" to get status data.
7. save the status data in "status.json".
8. run "python comment_parser.py 1 comment.html share.json status.json" to generate "data.tsv", "barData.tsv" and "page2.json". Change the "1" to "2" for Chinese subjects.

9. Download the profile pic as profile.jpg
10. Change name in page2.html
11. Upload the files to the server
run move.sh