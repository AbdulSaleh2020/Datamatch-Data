import numpy
import csv

data = open('anon_answer_data_2016.csv','r')
lines = data.readlines()

questions = open('Questions.txt')
questionlines = questions.readlines()

file1=open('questionanswers.csv','wb')
writer1 = csv.writer(file1)

answers = numpy.zeros((31,5), dtype=numpy.int)
for i in range(4196): #Number of people 4196
	line = lines[i].split(',')
	for j in range(31):
		if line[j+5]=='A' or line[j+5]=='A\r\n':
			answers[j][0]+=1
		elif line[j+5]=='B' or line[j+5]=='B\r\n':
			answers[j][1]+=1
		elif line[j+5]=='C' or line[j+5]=='C\r\n':
			answers[j][2] +=1
		elif line[j+5]=='D' or line[j+5]=='D\r\n':
			answers[j][3] +=1
		elif line[j+5]=='E' or line[j+5]=='E\r\n':
			answers[j][4] +=1
for i in range(31):
	row = [questionlines[1+6*i]] + [questionlines[1+6*i+1]] + [answers[i][0]]+ [questionlines[1+6*i+2]] + [answers[i][1]]+[questionlines[1+6*i+3]] + [answers[i][2]]+[questionlines[1+6*i+4]] + [answers[i][3]]+[questionlines[1+6*i+5]] + [answers[i][4]]
	writer1.writerow(row)


