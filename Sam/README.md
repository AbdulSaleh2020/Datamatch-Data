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

Current bug: d3 is trying to link nodes based upon index.  My workaround to finding the index of a node was just to use its number - 1, but this isn't right because the nodes aren't strictly chronological.  I need a better parrsed file! To do this I'm going to parse the nodes first so i know their index then do the others.  



New problem, some numbers are skipped - I.E 3909