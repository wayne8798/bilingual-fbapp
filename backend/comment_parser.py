import bs4
import random

def monthConvert(m):
	year = m[6:10]
	month = m[11:]
	if len(month) == 1:
		month = '0' + month
	return year + month
def formatComments(data):
	soup = bs4.BeautifulSoup(data)
	entry_ls = []
	for month in soup.find_all("div", class_="_iqp stat_elem"):
		time = monthConvert(month["id"])
		for tr in month.find_all("tr"):
			info_msg_switch = 0;
			entry = {}
			for td in tr.find_all("td"):
				if info_msg_switch == 0:
					info = td.find("div", class_="_42ef")
					if info != None and info.div != None:
						links = info.div.find_all("a") 
						if len(links) > 1:
							entry["link"] = links[1]["href"] + "\n"
							info_msg_switch = 1
				else:
					msgs = td.find_all("div", class_="fsm")
					for msg in msgs:
						if len(msg["class"]) == 1:
							entry["text"] = msg.get_text()
			if info_msg_switch > 0:
				entry["time"] = time
				entry_ls.append(entry)
	return entry_ls

def langCheck(us):
	engFlag = 0
	chiFlag = 0
	for ch in us:
		if u'A' <= ch <= u'Z' or u'a' <= ch <= u'z':
			engFlag = 1
		if u'\u4e00' <= ch <= u'\u9fff' or \
			u'\uac00' <= ch <= u'\ud7af':
			chiFlag = 1
		if engFlag == 1 and chiFlag == 1:
			break

	# return 0 for English, 1 for none-English, 2 for both
	if engFlag == 1 and chiFlag == 1:
		return 2
	elif chiFlag == 1:
		return 1
	else:
		return 0

def outputData(data):
	table_stats = {}
	for entry in data:
		time = entry["time"]
		text_lang = langCheck(entry["text"])
		if not time in table_stats.keys():
			table_stats[time] = {'eng': 0, 'other': 0, 'both': 0}
		if text_lang == 0:
			table_stats[time]['eng'] += 1
		elif text_lang == 1:
			table_stats[time]['other'] += 1
		else:
			table_stats[time]['both'] += 1
	output = open('data.tsv', 'w')
	output.write('date\tEnglish\tOther\tBoth\n')
	for time in table_stats:
		d = table_stats[time]
		row = time + '\t' + str(d['eng']) + '\t' + \
			str(d['other']) + '\t' + str(d['both']) + '\n'
		output.write(row)
	output.close()

def pickComments(data, limit):
	engLs = []
	noneEngLs = []
	bothLs = []
	for entry in data:
		text_lang = langCheck(entry["text"])
		if text_lang == 0:
			engLs.append(entry)
		elif text_lang == 1:
			noneEngLs.append(entry)
		else:
			bothLs.append(entry)
	if len(engLs) < limit:
		print engLs
	else:
		print random.sample(engLs, limit)

	if len(noneEngLs) < limit:
		print noneEngLs
	else:
		print random.sample(noneEngLs, limit)

	if len(bothLs) < limit:
		print bothLs
	else:
		print random.sample(bothLs, limit)


comments_file = open("comments_test.html", "r")
comments_data = comments_file.read()
comments_file.close()

clean_data = formatComments(comments_data)
outputData(clean_data)
pickComments(clean_data, 2)