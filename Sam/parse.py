#!/usr/bin/env python
#Monday, January 2 2017

import json
import random


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
	# create an array to hold all the connections that have been added
	matchesEntered[Id] = []



### MAKE SPOOF DICTIONARY
spoofDict = dict()
options = set(indexDict.keys())
for key in indexDict:
	spoofId = key
	while(spoofId == key):
		spoofId = random.sample(options, 1)[0]
		if (len(options) == 1):
			break
	options.remove(spoofId)
	spoofDict[key] = spoofId

### Change the nodes array 
newNodes =[]
for j in nodes: 
	newId = spoofDict[j['Id']]
	#print("OLD ID: " + str(j['Id']) + "\t NEW ID\t " + str(newId) + "\n")
	j['Id'] = newId
	newNodes.append(j)

# Once we've finished building this indexDict, loop through to build edges
for key in indexDict:
	# Only take the first 3 matches
	matches = indexDict[key]['matches'][0:3]
	# Only take the first match
	# matches = indexDict[key]['matches'][0:1]
	sourceIndex = indexDict[key]['index']
	for match in matches:
		#q1 is eligible
		#q2 means this person wants to match
		#q3 means the other person wants to match
		target, q1, q2, q3 = match.split(",")
		sourceNode = key
		targetNode = target
		if targetNode in matchesEntered.keys():
			# Filter out edges we've already tracked
			if sourceNode not in matchesEntered[targetNode]:
				# Keep track of this so we can filter in the future
				matchesEntered[sourceNode].append(targetNode)

				# Get the target's key
				if target in indexDict.keys():
					targetIndex = indexDict[target]['index']
					# Source ndoe and target node 
					# Changing this so that it's by source node and target node..
					# To change back: sourceIndex and targetIndex 
					connection_dict = {'source':int(spoofDict[sourceNode]), 'target':int(spoofDict[targetNode]), 'eligible':q1, 'interested':q2, 'reverse interest':q3}
					edges.append(connection_dict)
myOutput = {'nodes':nodes, 'edges':edges}
print(json.dumps(myOutput))
