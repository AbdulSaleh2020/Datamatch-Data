Description of what is in Russell's folder:

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
