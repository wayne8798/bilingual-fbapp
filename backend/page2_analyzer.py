import sys
import os

def reset_output():
	with open("page2_eng.csv", "w") as f:
		f.write("")
	with open("page2_l1.csv", "w") as f:
		f.write("")
	with open("page2_both.csv", "w") as f:
		f.write("")

def process_output(output, post_no):
	output = output + "\n"
	if post_no == "1" or post_no == "2":
		with open("page2_eng.csv", "a") as f:
			f.write(output)
	elif post_no == "3" or post_no == "4":
		with open("page2_l1.csv", "a") as f:
			f.write(output)
	else:
		with open("page2_both.csv", "a") as f:
			f.write(output)

def process_lines(ref_code, lines):
	flag3 = False
	dict3 = {"family":0, "work":1, "friends":2, "hobby":3, \
		"neighbor":4, "religious":5, "everyone":6, "other":7}
	data3 = [0,0,0,0,0,0,0,0]

	flag4 = False
	dict4 = {"appropriate":0, "audience":1, "quote":2, "habitual":3, \
	"knowledge":4, "other":5}
	data4 = [0,0,0,0,0,0]

	flag4b = False
	dict4b = {"appropriate":0, "audience":1, "quote":2, "habitual":3, \
	"knowledge":4, "other":5}
	data4b = [0,0,0,0,0,0]

	output = ""
	post_no = ""
	for line in lines:
		if len(line) >= 6 and line[:4] == "Post":
			if len(output) > 0:
				process_output(output, post_no)
			post_no = line[5]
			output = ref_code + "," + post_no
			continue

		if len(line) >= 2 and line[:2] == "1.":
			if line[41:43] == "No":
				output += ",0"
			else:
				output += ",1"
			continue

		if len(line) >= 2 and line[:2] == "2.":
			if line[42:44] == "No":
				output += ",0"
			else:
				output += ",1"
			continue

		if len(line) >= 2 and line[:2] == "3.":
			flag3 = True
			continue

		if len(line) > 2 and flag3 == True:
			key = line[:-2]
			if key in dict3.keys():
				data3[dict3[key]] = 1
			else:
				flag3 = False
				for i in data3:
					output += "," + str(i)
				data3 = [0,0,0,0,0,0,0,0]	
			continue

		if len(line) == 2 and flag3 == True:
			flag3 = False
			for i in data3:
				output += "," + str(i)
			data3 = [0,0,0,0,0,0,0,0]
			continue

		if len(line) >= 2 and line[:2] == "3b":
			if line[83:85] == "No":
				output += ",0"
			else:
				output += ",1"
			continue

		if len(line) >= 2 and line[:2] == "3c":
			output += "," + line[96]
			continue

		if len(line) >= 2 and line[:2] == "4.":
			flag4 = True
			continue

		if len(line) > 2 and flag4 == True:
			key = line[:-1]
			if key in dict4.keys():
				data4[dict4[key]] = 1
			else:
				flag4 = False
				for i in data4:
					output += "," + str(i)
				data4 = [0,0,0,0,0,0]	
			continue

		if len(line) == 2 and flag4 == True:
			flag4 = False
			for i in data4:
				output += "," + str(i)
			data4 = [0,0,0,0,0,0]
			continue

		if len(line) >= 2 and line[:2] == "4b":
			flag4b = True
			continue

		if len(line) > 2 and flag4b == True:
			key = line[:-1]
			if key in dict4b.keys():
				data4b[dict4b[key]] = 1
			else:
				flag4b = False
				for i in data4b:
					output += "," + str(i)
				data4b = [0,0,0,0,0,0]	
			continue

		if len(line) == 2 and flag4b == True:
			flag4b = False
			for i in data4b:
				output += "," + str(i)
			data4b = [0,0,0,0,0,0]
			continue

		if len(line) >=2 and line[:2] == "5.":
			output += "," + line[113]
	process_output(output, post_no)

reset_output()

for fname in os.listdir("."):
	name_flag = True
	for c in fname:
		if c < '0' or (c > '9' and c < 'A') or c > 'Z':
			name_flag = False
			break

	if name_flag == True and len(fname) == 4:
		page2_name = fname + "/" + fname + "-page2.txt"
		pdata = open(page2_name, "r")
		lines = pdata.readlines()
		process_lines(fname, lines)
		pdata.close()