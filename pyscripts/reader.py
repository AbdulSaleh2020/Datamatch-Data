import numpy
import csv

data = open('data.txt','r')
lines = data.readlines()

#Let's first start by defining functions.  

error1 = [] #For lookup_attribute.  ['3909', '4753', '3400', '3399', '4729', '4740'] are final errors.
def lookup_attribute(id_number,attribute_number): #Note that id_number is a string
	checking = 0  
	for i in range(4196):
		line = lines[i].split(':')
		if line[0]==id_number:
			return line[attribute_number]
		else: 
			checking +=1 
	if checking == 4196: #Checked through all lines, saw no instances of id_number
		error1.append(id_number)
		return "False"

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

#These steps take a long time and really only need to be done once
'''
matches = numpy.zeros((30,30), dtype=numpy.int) #Setting up the match matrix

for i in range(4196): #4196 lines total
	line = lines[i].split(':')
	length = len(line)
	#Max length = 24, max matches =24-5=19
	#First make all rows the same length, length 24
	for i in range(24-length):
		line.append(0)
	index, year, house, gender, seeking, match1, match2, match3, match4, match5, match6, match7, match8, match9, match10, match11, match12, match13, match14, match15, match16, match17, match18, match19=line
	personhouse = housenumber(house) #min([12,housenumber(house)]) #Taking min to deal with freshman case
	for j in range(length-5): #Number of matches
		match = line[5+j]
		matcharray=match.split(',')
		if lookup_attribute(matcharray[0],2) != 'False':
			targethouse = housenumber(lookup_attribute(matcharray[0],2))
			matches[personhouse][targethouse] +=1

print error1 #Unmatched id numbers
print error2 #People without houses
file1=open('matchmatrix.csv','wb')
writer1 = csv.writer(file1)
listhouses = ['Houses'] + houselist 
writer1.writerow(listhouses)
for i in range(30):
	row = [houselist[i]]
	for j in range(30):
		row += [matches[i][j]]
	writer1.writerow(row)
'''

#General Match Data

file2=open('matchcomposition.csv','wb')
writer2 = csv.writer(file2)
comprehensive = numpy.zeros((30,3,5,3),dtype=numpy.int) #House, Gender, Year, Stats [[[[0]*3]*4]*2]*29 

for i in range(4196):  #4196
	likes_recieved=0
	likes_given = 0
	line = lines[i].split(':')
	length = len(line)
	year = yearnumber(line[1])
	house = housenumber(line[2])
	gender = gendernumber(line[3])
	for j in range(length-5): 
		match = line[5+j]
		matcharray=match.split(',')
		if matcharray[1]=="true": #Eligible for match
			if matcharray[2] == "true":
				likes_given +=1
			if matcharray[3]=="true":
				likes_recieved +=1
	comprehensive[house][gender][year][0]+=1 #Zero indexed 
	comprehensive[house][gender][year][1]+=likes_given
	comprehensive[house][gender][year][2]+=likes_recieved

#Now let's look at what happens 
writer2.writerow(['House', 'Gender', 'Year', 'Participation', 'Likes Given', 'Likes Recieved'])
participation = 0 #Sanity check statistics
likes_gall=0
likes_rall=0
for i in range(30):
	for j in range(3):
		for k in range(5):
			participation += comprehensive[i][j][k][0]
			likes_gall += comprehensive[i][j][k][1]
			likes_rall += comprehensive[i][j][k][2]
			row = [houselist[i], genderlist[j], yearlist[k], comprehensive[i][j][k][0],comprehensive[i][j][k][1],comprehensive[i][j][k][2]]
			writer2.writerow(row)



'''
matcheshistogram=[]  #Tells us how many people got X matches.
for i in range(30):
	matcheshistogram.append(0) 
for i in range(4196):
	matcheshistogram[len(lines[i].split(':')) - 5]+=1
# print matcheshistogram 

'''








