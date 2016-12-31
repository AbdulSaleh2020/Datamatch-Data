import numpy
import csv

data = open('anon_answer_data_2016.csv','r')
lines = data.readlines()

questions = open('Questions.txt')
questionlines = questions.readlines()

file1=open('questionanswers.csv','wb')
file2=open('answersbytype.csv', 'wb')
writer1 = csv.writer(file1)
writer2 = csv.writer(file2)




# data = open('data.txt','r')
# lines = data.readlines()

#Let's first start by defining functions.  

error1 = [] #For lookup_attribute.  ['3909', '4753', '3400', '3399', '4729', '4740'] are final errors.
# def lookup_attribute(id_number,attribute_number): #Note that id_number is a string
# 	checking = 0  
# 	for i in range(4196):
# 		line = lines[i].split(':')
# 		if line[0]==id_number:
# 			return line[attribute_number]
# 		else: 
# 			checking +=1 
# 	if checking == 4196: #Checked through all lines, saw no instances of id_number
# 		error1.append(id_number)
# 		return "False"

genderlist = ['Male', 'Female', 'Error'] #As in reading error, since we only allow these option.  Trans people are welcome.
def gendernumber(gender):
	if gender == "Male" or gender == "Men":
		return 1
	elif gender =="Women" or gender == "Female":
		return 0
	else:
		return 2

yearlist = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Error']
def yearnumber(year):
	if year == "Freshman":
		return 0
	elif year == "Sophomore":
		return 1
	elif year == "Junior":
		return 2
	elif year == "Senior":
		return 3
	else:
		return 4

houselist = ['Leverett', 'Kirkland', 'Cabot', 'Lowell', 'Adams', 'Dunster', 'Mather', 'Winthrop', 'Pforzheimer', 'Currier', 'Quincy', 'Eliot', 'Wigglesworth', 'Holworthy', 'Thayer', 'Weld', 'Matthews', 'Hurlbut','Apley', 'Pennypacker', 'Hollis', 'Lionel', 'Mass Hall', 'Grays', 'Canaday', 'Greenough', 'Mower', 'Stoughton', 'Straus', 'None']

error2 = [] #Errors with residence
def housenumber(residence):
	checking = 0
	for i in range(29):
		if houselist[i]==residence:
			return i
		else:
			checking +=1
	if checking == 29: #Not in houselist
		error2.append(residence)
		return 29








#31 Questions, 5 possible answers
answers = numpy.zeros((31,5), dtype=numpy.int)

#Questions, Responses, Houses, Year, Gender
answers2 = numpy.zeros((31, 5, 30, 5,3),dtype=numpy.int) 
for i in range(4196): 
	line = lines[i].split(',')
	house_number = housenumber(line[2])
	year_number = yearnumber(line[1])
	gender_number = gendernumber(line[3])
	for j in range(31):
		if line[j+5]=='A' or line[j+5]=='A\r\n':
			answers2[j][0][house_number][year_number][gender_number]+=1
		elif line[j+5]=='B' or line[j+5]=='B\r\n':
			answers2[j][1][house_number][year_number][gender_number]+=1
		elif line[j+5]=='C' or line[j+5]=='C\r\n':
			answers2[j][2][house_number][year_number][gender_number]+=1
		elif line[j+5]=='D' or line[j+5]=='D\r\n':
			answers2[j][3][house_number][year_number][gender_number]+=1
		elif line[j+5]=='E' or line[j+5]=='E\r\n':
			answers2[j][4][house_number][year_number][gender_number]+=1

#For the title row
titlerow = [0]
for k in range(29):
	for l in range(4):
		for m in range(2):
			titlerow += [houselist[k] + yearlist[l] + genderlist[m] ]

writer2.writerow(titlerow)

options = ['A', 'B', 'C', 'D', 'E'] 
for i in range(31): #Looking over each question
	for j in range(5): #Over each response
		row = [str(i+1)+options[j]] 
		for k in range(29):
			for l in range(4):
				for m in range(2):
					row += [answers2[i][j][k][l][m]]
		writer2.writerow(row)

'''FOR AGGREGATE DATA'''
# for i in range(4196): #Number of people 4196
# 	line = lines[i].split(',')
# 	for j in range(31):
# 		if line[j+5]=='A' or line[j+5]=='A\r\n':
# 			answers[j][0]+=1
# 		elif line[j+5]=='B' or line[j+5]=='B\r\n':
# 			answers[j][1]+=1
# 		elif line[j+5]=='C' or line[j+5]=='C\r\n':
# 			answers[j][2] +=1
# 		elif line[j+5]=='D' or line[j+5]=='D\r\n':
# 			answers[j][3] +=1
# 		elif line[j+5]=='E' or line[j+5]=='E\r\n':
# 			answers[j][4] +=1
# for i in range(31):
# 	row = [questionlines[1+6*i]] + [questionlines[1+6*i+1]] + [answers[i][0]]+ [questionlines[1+6*i+2]] + [answers[i][1]]+[questionlines[1+6*i+3]] + [answers[i][2]]+[questionlines[1+6*i+4]] + [answers[i][3]]+[questionlines[1+6*i+5]] + [answers[i][4]]
# 	writer1.writerow(row)


