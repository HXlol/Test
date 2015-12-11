//the app.js can run in the mongo by using the code mongo localhost:27017/hxdata E:/monfodb/app.js,the result should show in the mmongo.




print('Query1: How many unique user are there?');
var total_user = db.userhx.distinct("id_member").length;
print('Total user:'+total_user);



 
 print('Query2: How many tweets(%) did the top 10 users measured by the number of messages) publish?');
 var total_tweets = db.userhx.find().count();
 var top_10 = db.userhx.aggregate([{$group:{_id:"$id_member",num_sum:{$sum:1}}},{$sort:{num_sum:-1}},{$limit:10}]);
 print(JSON.stringify(top_10));



print('Query3:What was the earliest and lastet data (YYYY-MM-DD HH:MM:SS) that a message was published?');
var edate = db.userhx.find({},{"timestamp":1,"_id":0}).sort({timestamp: 1}).limit(1);
var num1=0;
var num2=0;
if (edate.length()) {
	e = edate[0];
	print( 'Earliest date: '+ e['timestamp']);
	num1=e['timestamp'];
}
var ldate = db.userhx.find({},{"timestamp":1,"_id":0}).sort({timestamp: -1}).limit(1);
if (ldate.length()){
   l = ldate[0];
   print('Latestdate: '+ l['timestamp']);
   num2=l['timestamp'];
}



print('Query4: What is the mean time delta between all message?');

function getTime(day){
	re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
	return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
}


var d1 = getTime(num1);
var d2 = getTime(num2);
var mean=(d2-d1)/total_tweets;
print('Delta meantime = '+mean);





print('Query5: What is the mean length of a message');
var c = 0;
var total_tweets = db.userhx.find().count();
db.userhx.find({},{"text":1 , "_id":0}).forEach(function(myDoc){
	c += myDoc.text.toString().length;
})
print(c/total_tweets);




print('Query7: What is the average number of hashtags(#)used within a message?');
var b = 0;
var re = new RegExp("#");
var a=0;
db.userhx.find({}, {_id: 1, text: 1}).forEach(function(doc){
a = doc.text.toString().match(re)
if(a !== null){
b += a.length; }})
print(b/(total_tweets));
