/* From Firebase website, generated after registration */
//var readline = require('readline');
var chalk = require('chalk');
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
			console.log(chalk.red.bold('Input not recognized'));
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
			console.log(chalk.red.bold('Title: "'+note_title+'" already exits, please change title and try again!!!'));
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
	var childkey = [], childdata = [], bodyList = [], dateList = [], titleList = [],i = 0;
	var lisDateList = [], lisBodyList = [],lisTitleList = [];
	firebase.database().ref().orderByChild('Time').on('value', function(snapshot){ /*limitToLast(limit).*/
		snapshot.forEach(function(childSnapshot){
			childkey.push(childSnapshot.key);
			 childdata.push(childSnapshot.val());
		});
		for (var item of childdata){
			bodyList.push(item.Body);
			dateList.push(item.Date);
			titleList.push(item.Title);
		};
		for (var jj=0;jj<dateList.length;jj+=1){
			lisDateList.push(dateList.splice(jj,limit));
			lisBodyList.push(bodyList.splice(jj,limit));
			lisTitleList.push(titleList.splice(jj,limit));
		};//console.log(lisTitleList);
		for (var j = 0; i < parseInt(limit); i += 1){
			display = '\nTitle:   '+titleList[i] +'\n'+ 'Date:   '+dateList[i] +'\n'+ 'Body:   '+bodyList[i]+ '\n';
			console.log(display);
		};
		nextPrev(titleList, limit, i, lisTitleList, lisDateList, lisBodyList);
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
			foundBody = foundBody.replace(new RegExp(query_string, "i"),chalk.red.underline.bold(query_string));
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
		console.log(chalk.red.bold('"'+query_string+'" not found, pls try another search!!'));
	};//console.log(founddateList);
});
};

/* This line makes the next invoke to function*/
function nextPrev(titleList, limit,i,titleList,dateList,bodyList){
	rl.question('Enter "next" to scroll to next page, "prev" for the previous view, or "any other key" to exit :', (answer) => {
		if (answer == 'next'){
			i += 1;
		}
		if (answer == 'prev'){
			i -= 1;
		}
		if (answer != 'next' && answer != 'prev'){
			process.exit();
		}
		for (var d = i; d < parseInt(limit); d += 1){
			console.log('\nTitle:   '+lisTitleList[d] +'\n'+ 'Date:   '+lisDateList[d] +'\n'+ 'Body:   '+lisBodyList[d]+ '\n');
		}
		if (d < Math.floor(titleList.length/limit)){
			nextPrev(titleList, limit,i,lisTitleList,lisDateList,lisBodyList);
		}
	});
	
}


main();