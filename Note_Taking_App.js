/* From Firebase website, generated after registration */
//var readline = require('readline');
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
	var test = false;
	var d = new Date();
	var date = d.toUTCString();
	var ts = d.getTime();
	//var database = firebase.database().ref();
	var childdata = [];
	firebase.database().ref().on('value', function(snapshot){
		snapshot.forEach(function(childSnapshot){
			childdata.push(childSnapshot.val());
		});
		var titleList = [];
		for (var item of childdata){
			titleList.push(item.Title);
		};
		for (var k = 0; k < titleList.length; k += 1){
			//console.log(titleList[k]);
			if (titleList[k].toLowerCase() === note_title.toLowerCase()) {
				test = true;
				break;
		  	}
		}	
	});
/////////////////////////////////////////////////////////////////////////////////
		if (test === false){
			firebase.database().ref().push({Title:note_title, Body:note_content, Time:ts, Date:date});//creates database..... Time:ts,
			var generated_id = firebase.database().ref().child('posts').push().key;//gets the generated id
			console.log('\n\nTitle:   '+ note_title + '\n' +'Id:   '+ generated_id + '\n' +'Date:   '+date + '\n' +'Note Content:   '+ note_content);
		} else {
			console.log('Title: "'+note_title+'" already exits, please change title and try again!!!');
		}
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
	var childkey = [];
	var childdata = [];
	firebase.database().ref().orderByChild('Time').on('value', function(snapshot){ /*limitToLast(limit).*/
		snapshot.forEach(function(childSnapshot){
			childkey.push(childSnapshot.key);
			 childdata.push(childSnapshot.val());
		});
		//console.log(childdata);
		var bodyList = []; var dateList = []; var titleList = [];
		for (var item of childdata){
			bodyList.push(item.Body);
			dateList.push(item.Date);
			titleList.push(item.Title);
		};var i = 0;
		while (i <= Math.floor(titleList.length/limit)){
			  limitedBodyList = bodyList.splice(0, limit);
			  limitedDateList = dateList.splice(0, limit);
			  limitedTitleList = titleList.splice(0, limit);
			  for (var i=0; i < limitedBodyList.length; i += 1){
			  	console.log('\n\nTitle:   '+limitedTitleList[i] +'\n'+ 'Date:   '+limitedDateList[i] +'\n'+ 'Body:   '+limitedBodyList[i]);
			  	continue;
			  }
			  if (titleList.length === 0){
			    break;
			  };
			};//////
	});
};

function SearchNotes(query_string, limit){
	/*copied from list note*/
	var childkey = [];
	var childdata = [];
	firebase.database().ref().orderByChild('Time').on('value', function(snapshot){ /*limitToLast(limit).*/
		snapshot.forEach(function(childSnapshot){
			childkey.push(childSnapshot.key);
			 childdata.push(childSnapshot.val());
		});
	var bodyList = []; var dateList = []; var titleList = [];
	for (var item of childdata){
		bodyList.push(item.Body);
		dateList.push(item.Date);
		titleList.push(item.Title);
	};/*copy ends here*/
	var foundTitleList = [];
	var founddateList = [];
	var foundBodyList = [];
	for(var j = 0; j < bodyList.length; j += 1){
		var n = bodyList[j].search(new RegExp(query_string, "i"));
		//console.log(n);
		if (n != -1){
			foundTitleList.push(titleList[j]);
			founddateList.push(dateList[j])
			foundBody = bodyList[j];
			foundBody = foundBody.replace(query_string,'*'+query_string+'*');
			foundBodyList.push(foundBody);
		};
	};//console.log(foundTitleList);
	for (var i = 0; i < parseInt(limit); i += 1){
		console.log('\n\nTitle:   '+foundTitleList[i] +'\n'+ 'Date:   '+founddateList[i] +'\n'+ 'Body:   '+foundBodyList[i]);
	}
});
};//
main();