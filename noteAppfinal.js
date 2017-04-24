/* From Firebase website, generated after registration */
//var readline = require('readline');
var readline = require('readline');
var firebase = require("firebase");
  var config = {
    apiKey: "AIzaSyBIoHuV4kqJUG7vZalo6s9uodRUHpfjdWo",
    authDomain: "note-taking-application-605e8.firebaseapp.com",
    databaseURL: "https://note-taking-application-605e8.firebaseio.com",
    projectId: "note-taking-application-605e8",
    storageBucket: "note-taking-application-605e8.appspot.com",
    messagingSenderId: "329355161103"
  };
  firebase.initializeApp(config);
 //var rl = readline.createInterface(process.stdin, process.stdout);

/* Passing argument through cmd */ 
var rl = readline.createInterface(process.stdin, process.stdout);
var processData = process.argv.slice(2);
var args = [];
processData.forEach (function(value){
	args.push(value);
});

//console.log(args[1],args[2]);

/* Catching the various first arguments */
function main(){
	switch (args[0])
	{
		case 'createnote':
			CreateNote(args[1],args[2]);
			break;
		case 'viewnote':
			ViewNote(args[1]);
			break;
		case 'deletenote':
			DeleteNote(args[1]);
			break;
		case 'listnotes':
			ListNote(args[1]);
			break;
		case 'searchnotes':
			SearchNotes(args[1],args[2]);
			break;
		default:
			console.log('Command not recognized, pls try again');
	};
};

/* Creating function */
function CreateNote (note_title, note_content){
	var test = 'falses', d = new Date(), date = d.toUTCString(), ts = d.getTime(), childdata = [], titleList = [];
	firebase.database().ref().on('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			childdata.push(childSnapshot.val());
		});
		for (var item of childdata){
			titleList.push(item.Title);
		};
		for (var k = 0; k < titleList.length; k += 1){
			if (titleList[k] === note_title) {
				test = 'trues';
				break;
			};
		};
		if (test === 'falses'){
			firebase.database().ref().push({Title:note_title, Body:note_content, Time:ts, Date:date});//creates database.
			var generated_id = firebase.database().ref().child('posts').push().key;//gets the generated id
			console.log('\n\nTitle:   '+ note_title + '\n' +'Id:   '+ generated_id + '\n' +'Date:   '+date + '\n' +'Note Content:   '+ note_content);
		}else{
			console.log('Title: "'+note_title+'" already exits, please change title and try again!!!');
		};
	});
};

/* Viewing function */
function ViewNote(note_id){
	var noteBody = firebase.database().ref().child(note_id);
	noteBody.on('value', function(datasnapshot){
		noteBody = datasnapshot.val();
		console.log('\n\nTitle:   '+noteBody.Title +'\n'+ 'Date:   '+noteBody.Date +'\n'+ 'Body:   '+noteBody.Body);
	});
};

/* Deleting function */
function DeleteNote(note_id){
	try {
		var Database = firebase.database().ref().child(note_id).remove();
		console.log('\n\nNote with id:   "' +note_id+ '"   has been deleted.')
	}
	catch(err) {
		console.log(err.name);
	}
};

/* List notes function */
function ListNote(limit){
	var childkey = [], childdata = [], bodyList = [], dateList = [], titleList = [];
	firebase.database().ref().orderByChild('Time').on('value', function(snapshot){ /*limitToLast(limit).*/
		snapshot.forEach(function(childSnapshot){
			childkey.push(childSnapshot.key);
			 childdata.push(childSnapshot.val());
		});
		for (var item of childdata){
			bodyList.push(item.Body);
			dateList.push(item.Date);
			titleList.push(item.Title);
		};console.log(titleList);
		for (var ii = 0; ii < Math.floor(titleList.length/limit); ii +=1){
			for (var i = 0; i < parseInt(limit); i += 1){
				console.log('\n\nTitle:   '+titleList[i] +'\n'+ 'Date:   '+dateList[i] +'\n'+ 'Body:   '+bodyList[i]);
			};
			titleList.splice(0, limit); dateList.splice(0, limit); bodyList.splice(0, limit);
			rl.question("Enter next to view more notes:   ", function(answer){
			if (answer !== 'next'){
				process.exit();
			};
		});
		};
	});
};

function SearchNotes(query_string, limit){
	/*copied from list note*/
	var childkey = [], childdata = [], foundTitleList = [], founddateList = [], foundBodyList = [], 
	bodyList = [], dateList = [], titleList = [];
	firebase.database().ref().orderByChild('Time').on('value', function(snapshot){ /*limitToLast(limit).*/
		snapshot.forEach(function(childSnapshot){
			childkey.push(childSnapshot.key);
			 childdata.push(childSnapshot.val());
		});
	for (var item of childdata){
		bodyList.push(item.Body);
		dateList.push(item.Date);
		titleList.push(item.Title);
	};/*copy ends here*/
	for(var j = 0; j < bodyList.length; j += 1){
		var n = bodyList[j].search(new RegExp(query_string, "i"));
		
		if (n != -1){
			foundTitleList.push(titleList[j]);
			founddateList.push(dateList[j])
			foundBody = bodyList[j];
			foundBody = foundBody.replace(query_string,'*'+ query_string +'*');
			foundBodyList.push(foundBody);
		};
	};
	for (var ii = 0; ii < Math.floor(foundTitleList.length/limit); ii +=1){
		for (var i = 0; i < parseInt(limit); i += 1){
			if (foundBodyList !== []){
				console.log('\n\nTitle:   '+foundTitleList[i] +'\n'+ 'Date:   '+founddateList[i] +'\n'+ 'Body:   '+foundBodyList[i]);
			};
		};
		titleList.splice(0, limit); dateList.splice(0, limit); bodyList.splice(0, limit);
		rl.question("Enter next to view more notes:   ", function(answer){
			if (answer !== 'next'){
				process.exit();
			};
		});
	};
	if (foundBodyList.length === 0){
		console.log('"'+query_string+'" not found, pls try another search!!');
	};//console.log(founddateList);
});
};



main();