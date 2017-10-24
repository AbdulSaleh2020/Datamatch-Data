# Datamatch-Data
All materials related to data visualization and stats analysis for the Harvard Computer Society (HCS) Datamatch Project.

Raw Data:
anon_answer_data_2016.csv #Answer data from last year
data.txt #Match Data from last year.
data.tsv #So far fictional data on response times.
Questions.txt #Last year's questions

Processed Data:
matchmatrix.csv #Matches by house/dorm
matchmatrixold.csv #Matches by house/dorm, but considers all freshmen the same.
questionanswers.csv #Obvious when you open it
matchcomposition.csv #Sees basic user stats by house/gender/year

Scripts:
houses.html #Pi Chart thing.  Sara is working on improving this.  I've copied over some of her edits to this.
linegraph.html #Uses data.tsv to plot responses vs. time
reader.py #Creates matchmatrix.csv and matchcomposition.csv by reading data.txt
answerReader.py #Creates questionanswers.csv



------
For network.html

Current project in this folder is the network visualization
This is still very rough, the visualization doesn't work yet because of an error in the way that I parsed

Step 1 was converting the json data into a text file.  parse.py does this (to run, "python parse.py > outputfilename.txt" in the terminal; make sure the data.txt file is in the same directory that you're in)
I included jsondatahead.txt and datahead.txt so that we could work initially with a smaller dataset


Format of the json output: 
json
	- nodes (array containing all nodes)
		- node objects 
			- House
			- Gender
			- Id
			- Interest
			- Year
	- edges (array containing all nodes)
		- edge objects
			- reverse interest
			- source
			- interested
			- target
			- eligible

PROBLEM: There are duplicate edges right now... 

The file network.html tests this.  It uses code copied from http://bl.ocks.org/jose187/4733747
Update: better tutorial http://bl.ocks.org/sathomas/11550728
http://flowingdata.com/2012/08/02/how-to-make-an-interactive-network-visualization/
https://medium.com/@sxywu/understanding-the-force-ef1237017d5#.ve7kaai5i
http://bl.ocks.org/mbostock/1667139 (Static loading page)
http://bl.ocks.org/norrs/2883411 (static dragging)
Current bug: d3 is trying to link nodes based upon index.  My workaround to finding the index of a node was just to use its number - 1, but this isn't right because the nodes aren't strictly chronological.  I need a better parrsed file! To do this I'm going to parse the nodes first so i know their index then do the others.  



New problem, some numbers are skipped - I.E 3909