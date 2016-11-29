import json

def main():
	adams = 0
	cabot = 0
	curr = 0
	dunst = 0
	eliot = 0
	kirk = 0
	lev = 0 
	low = 0 
	math = 0
	pfo = 0
	quin = 0
	win = 0
	frs = 0


	with open("data.txt") as data:
		for line in data:
			if "Adams" in line:
				adams = adams + 1
			elif "Cabot" in line:
				cabot = cabot +1
			elif "Currier" in line:
				curr = curr +1
			elif "Dunster" in line:
				dunst = dunst + 1
			elif "Eliot" in line:
				eliot = eliot + 1
			elif "Kirkland" in line:
				kirk = kirk + 1
			elif "Leverett" in line:
				lev = lev + 1
			elif "Lowell" in line:
				low = low + 1
			elif "Mather" in line:
				math = math + 1
			elif "Pforzheimer" in line:
				pfo = pfo + 1
			elif "Quincy" in line:
				quin = quin + 1 
			elif "Winthrop" in line:
				win = win + 1
			else:
				frs = frs + 1

	house_nums = {
		"Adams": adams,
		"Cabot": cabot,
		"Currier": curr,
		"Dunster": dunst,
		"Eliot": eliot,
		"Kirkland": kirk,
		"Leverett": lev,
		"Lowell": low,
		"Mather": math,
		"Pforzheimer": pfo,
		"Quincy": quin,
		"Winthrop": win,
		"Freshmen": frs
	}

	with open('result.json', 'w') as fp:
		json.dump(house_nums, fp)

if __name__ == "__main__": 
	main()