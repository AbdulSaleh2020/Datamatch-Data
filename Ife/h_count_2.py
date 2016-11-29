import json

def main():
	h_val=[0]
	for x in range(0,12):
		h_val.append(0)

	for val in h_val:
		val = 0 

	jsonlist = []

	houses=["Adams","Cabot","Currier","Dunster","Eliot","Kirkland",
	"Leverett","Lowell","Mather","Pforzheimer","Quincy","Winthrop","Freshman"]

	with open("data.txt") as data:
		for house in houses:
			data.seek(0, 0)
			for line in data:
				if house in line:
					h_val[houses.index(house)] = h_val[houses.index(house)] + 1 

			housejson={
				"House": house,
				"Value": h_val[houses.index(house)]
				}

			jsonlist.append(housejson)

	with open('result_2.json', 'w') as fp:
		json.dump(jsonlist, fp)



if __name__ == "__main__": 
	main()
