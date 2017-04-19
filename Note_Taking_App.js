console.log(" Type the following numbers to perform corresponding actions: \n1)To Create a note\n2)To View a single note.\n3)To Delete a single note\n4)To View a list of all the notes taken\n5)To Search notes ");

var readline = require('readline');

//////////////////////////////////////////////
var firebase = require("firebase");
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBIoHuV4kqJUG7vZalo6s9uodRUHpfjdWo",
    authDomain: "note-taking-application-605e8.firebaseapp.com",
    databaseURL: "https://note-taking-application-605e8.firebaseio.com",
    projectId: "note-taking-application-605e8",
    storageBucket: "note-taking-application-605e8.appspot.com",
    messagingSenderId: "329355161103"
  };
  firebase.initializeApp(config);
  ////////////////////////////////////////////////////////

var rl = readline.createInterface(process.stdin, process.stdout);

rl.question("Type Your Response:  ", function(answer){

	switch(answer) {
	    case '1':
	        console.log("Create a note");
	        CreateNote();
	        break;
	    case '2':
	        console.log("View a single note");
	        ViewNote();
	        break;
	    case '3':
	        console.log("Delete a single note");
	        DeleteNote();
	        break;
	    case '4':
	        console.log("View a list of all the notes taken");
	        ListOfNotesTaken();
	        break;
	    case '5':
	        console.log("Search notes");
	        SearchNote();
	        break;
	    default:
	        console.log("Input not recognized");
	}
});
/////////////////////////////////////////////////////////////////////////
function CreateNote(){
	rl.question('Please enter the Title : ', (noteTitle) => {
	    rl.question('Please type the Body : ', (noteBody) => {
	    	var database = firebase.database().ref();
			database.child(noteTitle).set(noteBody);
			
	    });
	    rl.close();
	});
};
////////////////////////////////////////////////////////////////////////////
function ViewNote(){
	rl.question('View by Title : ', function(noteTitle){
	var noteBody = firebase.database().ref().child(noteTitle);
	noteBody.on('value', function(datasnapshot){
	noteBody = datasnapshot.val();
	console.log(noteBody);
	rl.close();
});
});
};
//////////////////////////////////////////////////////////////////////////////
function DeleteNote(){
	rl.question('View by Title : ', function(noteTitle){
	var noteBody = firebase.database().ref().child(noteTitle);
	noteBody.on('value', function(datasnapshot){
		});
	noteBody.remove();
	//console.log(noteBody);
	rl.close();
});
};
////////////////////////////////////////////////////////////////////////////////////////
function ListOfNotesTaken(){
	rl.question("How many most recent Notes do You wish to list?   ", function(answer){
		console.log('recentPosts');
		var database = firebase.database().ref();
		database.on('value', function(datasnapshot){
			database = datasnapshot.val();
			keyList = [];
			valueList = [];
			for(keys in database){
				keyList.push(keys);
				values = database[keys];
				valueList.push(values);
			};
			for (var i = 0; i < parseInt(answer); i += 1){
				console.log(keyList[i] + '\n' + valueList[i]);
			}	
		});
		rl.close();
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////
function SearchNote(){
	rl.question('Which word do You want to search for? : ', (word) => {
	    rl.question('How many note findings do you want to see? : ', (noOfFindings) => {
			var database = firebase.database().ref();
			database.on('value', function(datasnapshot){
				database = datasnapshot.val();
				keyList = [];
				valueList = [];
				for(keys in database){
					var n = database[keys].search(new RegExp(word, "i"));
					if (n != -1){
						keyList.push(keys);
						values = database[keys];
						valueList.push(values);
					};
				};
				for (var i = 0; i < parseInt(noOfFindings); i += 1){
					console.log(keyList[i] + '\n' + valueList[i]);
				}
			});
		});
		rl.close();
	});
};

