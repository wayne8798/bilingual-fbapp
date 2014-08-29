import bs4
import json
import random
import sys
import re
import langid
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
		if u'\u3040' <= ch <= u'\u309f' or \
			u'\u30a0' <= ch <= u'\u30ff':
			return 3
		if u'A' <= ch <= u'Z' or u'a' <= ch <= u'z':
			engFlag = 1
		if u'\u4e00' <= ch <= u'\u9fff' or \
			u'\uac00' <= ch <= u'\ud7af':
			chiFlag = 1
		if engFlag == 1 and chiFlag == 1:
			break

	# return 0 for English, 1 for none-English,
	# 2 for both, 3 for other (Japanese & Spanish)
	if engFlag == 1 and chiFlag == 1:
		return 2
	elif chiFlag == 1:
		return 1
	else:
		if langid.classify(us)[0] == 'es':
			return 3
		else:
			return 0

def outputData(comments, shares, status):
	langid.set_languages(['en','es'])

	comments_count = [0, 0, 0, 0]
	shares_count = [0, 0, 0, 0]
	status_count = [0, 0, 0, 0]
	for entry in comments:
		comments_count[langCheck(entry["text"])] += 1

	for entry in shares:
		shares_count[langCheck(entry["owner_comment"])] += 1

	for entry in status:
		status_count[langCheck(entry["message"])] += 1

	print comments_count
	print shares_count
	print status_count

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

outputData(comments_data, shares_data, status_data)