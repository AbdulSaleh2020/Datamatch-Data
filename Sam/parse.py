#!/usr/bin/env python
#Monday, January 2 2017

import json

myfile = open('data.txt', 'r')
lines = myfile.readlines()
myfile.close()

nodes = []
edges = []
indexDict = {}
#use this to keep track of matches that have already occured 
matchesEntered = {}
for nodeIndex, line in enumerate(lines):	
	# unpack values
	line = line.strip('\n')
	splits = line.split(':')
	Id = splits[0]
	year = splits[1]
	house = splits[2]
	gender = splits[3] 
	interestedIn = splits[4] #gender
	# create dictionary
	node_dict = {'Id' : Id, 'Year' : year, 'House' : house, 'Gender' : gender, 'Interest' : interestedIn}
	# Add dictionary to list
	nodes.append(node_dict)
	matches = splits[5:len(splits)]
	# keep track of the node's index
	indexDict[Id] = {}
	indexDict[Id]['matches'] = matches
	indexDict[Id]['index'] = nodeIndex
	matchesEntered[Id] = {}
	
# Once we've finished building this indexDict, lop through to build edges
for key in indexDict:
	matches = indexDict[key]['matches']
	sourceIndex = indexDict[key]['index']
	for match in matches:
		#q1 is eligible
		#q2 means this person wants to match
		#q3 means the other person wants to match

		target, q1, q2, q3 = match.split(",")
		sourceNode = key
		targetNode = target
		if sourceNode not in matchesEntered[targetNode]:
			# Get the target's key
			if target in indexDict.keys():
				targetIndex = indexDict[target]['index']
				connection_dict = {'source':int(sourceIndex), 'target':int(targetIndex), 'eligible':q1, 'interested':q2, 'reverse interest':q3}
				edges.append(connection_dict)

myOutput = {'nodes':nodes, 'edges':edges}
print(json.dumps(myOutput))



### FIX MATCHES ENTERED CODE TO REDUCE DUPLICATE EDGES 
