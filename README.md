# Note-Taking-Console-APP
This is an Andela BootCamp-21 Final Project

PROJECT DESCRIPTION


- Notes application has the following commands:
    - `createnote <note_content>` - Create a note
    - `viewnote <note_id>` - View a single note
    - `deletenote <note_id>` - Delete a single note
    - `listnotes` - View a formatted list of all the notes taken
    - `searchnotes <query_string>` - View a formatted list of all the notes that can be identified by the query string
    - `listnotes, searchnotes` should have a `--limit` parameter for setting the number of items to display in the resulting list
    - `next` should be invoked to see the next set of data in the current running query
- Notes can be saved in memory but a database would be preferred (e.g Firebase, mlab)

**Extra Credit**

- Create a syncnotes command for automatically synchronising notes with an online datastore like Firebase, mlab or Parse 
- The Notes should be exportable and importable as CSV or JSON.
- prevent adding notes with duplicate titles
