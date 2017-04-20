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
//////////////////////////////////////////////////////////////////////////////////////////////////////
function continueExitLoop(){
	rl.question('Do you wish to go back to the main menu? (y/n) : ', function(answer){
		if (answer == 'y'){
			mainMenu();
		}else if (answer == 'n'){
			process.exit();
		}else{
			console.log('incorrect input, pls type y for yes or n for no');
			continueExitLoop();
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////////////////
function mainMenu(){
	console.log("Type the following numbers to perform corresponding actions: \n[1)] To Create a note\n[2] To View a single note.\n[3]To Delete a single note\n[4] To View a list of all the notes taken\n[5] To Search notes");
	rl.question("Type Your Response:  ", function(answer){
		if (answer == '1'){
	        console.log("Create a note");
	        CreateNote();
	    }else if (answer == '2'){
	        console.log("View a single note");
	        ViewNote();
	    }else if (answer == '3'){
	        console.log("Delete a single note");
	        DeleteNote();
	    }else if (answer == '4'){
	        console.log("View a list of all the notes taken");
	        ListOfNotesTaken();
	    }else if (answer == '5'){
	        console.log("Search notes");
	        SearchNote();
	    }else{
		    console.log("Input not recognized");
		}
	});
	
};
/////////////////////////////////////////////////////////////////////////
function CreateNote(){
	rl.question('Please enter the Title : ', (noteTitle) => {
	    rl.question('Please type the Body : ', (noteBody) => {
	    	var database = firebase.database().ref();
			database.child(noteTitle).set(noteBody);
			continueExitLoop();
		//rl.close();
	    });
	});
};
////////////////////////////////////////////////////////////////////////////
function ViewNote(){
	rl.question('View by Title : ', function(noteTitle){
	var noteBody = firebase.database().ref().child(noteTitle);
	noteBody.on('value', function(datasnapshot){
	noteBody = datasnapshot.val();
	console.log(noteBody);
	continueExitLoop();
	//rl.close();
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
	continueExitLoop();
	//rl.close();
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
		continueExitLoop();
		//rl.close();
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
				continueExitLoop();
			//rl.close();
			});
		});
	});
};

////////////////////////////////////////////////////////////////////////////////////////////
mainMenu();
//continueExitLoop()