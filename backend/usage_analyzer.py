import bs4
import json
import random
import sys
import re
from time import localtime, strftime
from sets import Set

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
			info_flag = 0;
			msg_flag = 0
			entry = {}
			for td in tr.find_all("td"):
				if info_flag == 0:
					info = td.find("div", class_="_42ef")
					if info != None and info.div != None:
						links = info.div.find_all("a") 
						if len(links) > 1:
							entry["link"] = links[1]["href"] + "\n"
							info_flag = 1
				else:
					msgs = td.find_all("div", class_="fsm")
					for msg in msgs:
						if len(msg["class"]) == 1:
							entry["text"] = msg.get_text()
							msg_flag = 1
			if info_flag > 0 and msg_flag > 0:
				entry["time"] = time
				entry_ls.append(entry)
	return entry_ls

def langCheck(us):
	# filter out names in the format of Axx Bxx.
	p = re.compile("[A-Z][a-z]* [A-Z][a-z]*")
	clean_us = p.sub("", us)

	engFlag = 0
	chiFlag = 0
	for ch in clean_us:
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

def convertTimeStamp(timestamp):
	time = localtime(timestamp)
	year = str(time.tm_year)
	month = str(time.tm_mon)
	if len(month) == 1:
		month = "0" + month
	return year + month

def timeCompare(a, b):
	if int(a[0:4]) == int(b[0:4]):
		return int(a[4:]) - int(b[4:])
	else:
		return int(a[0:4]) - int(b[0:4])

def outputData(comments, shares, status, lang_choice):
	if lang_choice == 1:
		other_lang = "Korean"
	else:
		other_lang = "Chinese"

	lang_ls = []
	for entry in comments:
		lang_ls.append([entry["time"], langCheck(entry["text"]), 0])

	for entry in shares:
		lang_ls.append([convertTimeStamp(entry["created_time"]), \
			langCheck(entry["owner_comment"]), 1])

	for entry in status:
		lang_ls.append([convertTimeStamp(entry["time"]), \
			langCheck(entry["message"]), 2])

	table_stats = {}
	bar_stats = {}
	years_ls = []
	for triple in lang_ls:
		time = triple[0]
		years_ls.append(time[:4])
		text_lang = triple[1]
		source = triple[2]

		if not time in table_stats.keys():
			table_stats[time] = {'eng': 0, 'other': 0, 'both': 0}

		if text_lang == 0:
			table_stats[time]['eng'] += 1
		elif text_lang == 1:
			table_stats[time]['other'] += 1
		else:
			table_stats[time]['both'] += 1

		if not time in bar_stats.keys():
			bar_stats[time] = {'eng': [0,0,0], "other": [0,0,0]}

		if text_lang == 0:
			bar_stats[time]["eng"][source] += 1
		elif text_lang == 1:
			bar_stats[time]["other"][source] += 1

	for y in Set(years_ls):
		for i in range(1, 10):
			time = y + "0" + str(i)
			if not time in table_stats.keys():
				table_stats[time] = {'eng': 0, 'other': 0, 'both': 0}
				bar_stats[time] = {'eng': [0,0,0], "other": [0,0,0]}				
		for i in range(10, 13):
			time = y + str(i)
			if not time in table_stats.keys():
				table_stats[time] = {'eng': 0, 'other': 0, 'both': 0}
				bar_stats[time] = {'eng': [0,0,0], "other": [0,0,0]}

	output = open('data.tsv', 'w')
	output.write('date\tEnglish\t' + other_lang + '\tBoth\n')

	for time in sorted(table_stats.keys(), cmp=timeCompare):
		d = table_stats[time]
		row = time + '\t' + str(d['eng']) + '\t' + \
			str(d['other']) + '\t' + str(d['both']) + '\n'
		output.write(row)
	output.close()

	outputBar = open("barData.tsv", "w")
	outputBar.write("date\tLanguage\tComments\tShares\tStatuses\n")

	for time in sorted(bar_stats.keys(), cmp=timeCompare):
		d = bar_stats[time]
		e_row = "{}\t{}\t{}\t{}\t{}\n".format(
				time, "English", d["eng"][0], d["eng"][1], d["eng"][2])
		o_row = "{}\t{}\t{}\t{}\t{}\n".format(
				time, other_lang, d["other"][0], d["other"][1], d["other"][2])
		outputBar.write(e_row)
		outputBar.write(o_row)
	outputBar.close()

comments_file = open(sys.argv[1], "r")
comments_raw_data = comments_file.read()
comments_file.close()

comments_data = formatComments(comments_raw_data)

# shares data retrieved using
# "SELECT owner_comment, title, created_time, \
# link_id, url from link WHERE owner = me() \
# and owner_comment <> "";"
shares_file = open(sys.argv[2], "r")
shares_raw_data = shares_file.read()
shares_file.close()

shares_data = json.loads(shares_raw_data)["data"]

# status data retrieved using
# "SELECT status_id, time, message FROM \
# status WHERE uid = me() and message <>"";"
status_file = open(sys.argv[3], "r")
status_raw_data = status_file.read()
status_file.close()

status_data = json.loads(status_raw_data)["data"]

outputData(comments_data, shares_data, status_data, lang_choice)
