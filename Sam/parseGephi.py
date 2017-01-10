#!/usr/bin/env python
#Monday, January 2 2017

import json

myfile = open('data.txt', 'r')
lines = myfile.readlines()
myfile.close()
f = open('gephiInput.gexf', 'w')

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
					#connection_dict = {'source':int(sourceIndex), 'target':int(targetIndex), 'eligible':q1, 'interested':q2, 'reverse interest':q3}
					connection_dict = {'source':int(key), 'target':int(target), 'eligible':q1, 'interested':q2, 'reverse interest':q3}

					edges.append(connection_dict)
myOutput = {'nodes':nodes, 'edges':edges}

f.write('<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2">\n')
f.write('<graph mode="static" defaultedgetype="directed">\n')
f.write('<attributes class="node">\n')
f.write('<attribute id="0" title="year" type="string"/>\n')
f.write('<attribute id="1" title="house" type="string"/>\n')
f.write('<attribute id="2" title="gender" type="string"/>\n')
f.write('<attribute id="3" title="interest" type="string"/>\n')
f.write('</attributes>\n')
f.write('<attributes class="edge">\n')
f.write('<attribute id="0" title="eligible" type="boolean"/>\n')
f.write('<attribute id="1" title="interested" type="boolean"/>\n')
f.write('<attribute id="2" title="reverse_interest" type="boolean"/>\n')
f.write('</attributes>\n')

f.write('<nodes>\n')
for nodeDict in myOutput['nodes']:
	f.write('<node id="%s">\n' % nodeDict['Id'])
	f.write('<attvalues>\n')
	f.write('<attvalue for="0" value="%s"/>\n' % nodeDict['Year'])
	f.write('<attvalue for="1" value="%s"/>\n' % nodeDict['House'])
	f.write('<attvalue for="2" value="%s"/>\n' % nodeDict['Gender'])
	f.write('<attvalue for="3" value="%s"/>\n' % nodeDict['Interest'])
	f.write('</attvalues>\n')
	f.write('</node>\n')
	#f.write('<node id="%s" year="%s" house="%s" gender="%s" interest="%s"/>\n' % (nodeDict['Id'], nodeDict['Year'], nodeDict['House'], nodeDict['Gender'], nodeDict['Interest']))
f.write('</nodes>\n')
f.write('<edges>\n')
for enum, edgeDict in enumerate(myOutput['edges']):
	f.write('<edge id="%s" source="%s" target="%s">\n' % (enum, edgeDict['source'], edgeDict['target']))
	f.write('<attvalues>\n')
	f.write('<attvalue for="0" value="%s"/>\n' % edgeDict['eligible'])
	f.write('<attvalue for="1" value="%s"/>\n' % edgeDict['interested'])
	f.write('<attvalue for="2" value="%s"/>\n' % edgeDict['reverse interest'])
	f.write('</attvalues>\n')
	f.write('</edge>\n')

	#f.write('<edge id="%s" source="%s" target="%s" eligible="%s" interested="%s" reverse_interest="%s"/>\n' % (enum, edgeDict['source'] , edgeDict['target'], edgeDict['eligible'], edgeDict['interested'], edgeDict['reverse interest']))
f.write('</edges>\n')
f.write('</graph>\n')
f.write('</gexf>\n')



#            <edge id="0" source="0" target="1" />




f.close()
