import bs4
import json
import random
from time import localtime, strftime

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

def convertTimeStamp(timestamp):
	time = localtime(timestamp)
	year = str(time.tm_year)
	month = str(time.tm_mon)
	if len(month) == 1:
		month = "0" + month
	return year + month


def outputData(comments, shares, status):
	lang_ls = []
	for entry in comments:
		lang_ls.append([entry["time"], langCheck(entry["text"])])

	for entry in shares:
		lang_ls.append([convertTimeStamp(entry["created_time"]), \
			langCheck(entry["owner_comment"])])

	for entry in status:
		lang_ls.append([convertTimeStamp(entry["time"]), \
			langCheck(entry["message"])])

	table_stats = {}
	for pair in lang_ls:
		time = pair[0]
		text_lang = pair[1]

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

def statusToPost(e, lang):
	output = {}
	if lang == 0:
		output["lang"] = "English"
	elif lang == 1:
		output["lang"] = "Other"
	else:
		output["lang"] = "Both"
	output["type"] = "Status Update"
	output["date"] = strftime("%a, %d %b %Y %H:%M:%S", localtime(e["time"]))
	output["message"] = e["message"]
	output["original"] = e["status_id"]

	return output

def shareToPost(e, lang):
	output = {}
	if lang == 0:
		output["lang"] = "English"
	elif lang == 1:
		output["lang"] = "Other"
	else:
		output["lang"] = "Both"
	output["type"] = "Share"
	output["date"] = strftime("%a, %d %b %Y %H:%M:%S", localtime(e["created_time"]))
	output["message"] = e["owner_comment"]
	output["original"] = e["url"]

	return output

def commentToPost(e, lang):
	output = {}
	if lang == 0:
		output["lang"] = "English"
	elif lang == 1:
		output["lang"] = "Other"
	else:
		output["lang"] = "Both"
	output["type"] = "Comment"
	output["date"] = e["time"]
	output["message"] = e["text"]
	output["original"] = e["link"]

	return output

def retrieveSample(comments, shares, status, limit, lang):
	outputLs = []
	if limit <= len(status):
		for e in random.sample(status, limit):
			outputLs.append(statusToPost(e, lang))
	else:
		for e in status:
			outputLs.append(statusToPost(e, lang))
		new_limit = limit - len(outputLs)
		if new_limit <= len(shares):
			for e in random.sample(shares, new_limit):
				outputLs.append(shareToPost(e, lang))
		else:
			for e in shares:
				outputLs.append(shareToPost(e, lang))
			new_limit = limit - len(outputLs)
			if new_limit <= len(comments):
				for e in random.sample(comments, new_limit):
					outputLs.append(commentToPost(e, lang))
			else:
				for e in comments:
					outputLs.append(commentToPost(e, lang))

	return outputLs


def pickComments(comments, shares, status, limit):
	# we try to sample from status first, then
	# shares, then comments.
	commEngLs = [e for e in comments if langCheck(e["text"]) == 0]
	commNonEngLs = [e for e in comments if langCheck(e["text"]) == 1]
	commBothLs = [e for e in comments if langCheck(e["text"]) == 2]

	shareEngLs = [e for e in shares if langCheck(e["owner_comment"]) == 0]
	shareNonEngLs = [e for e in shares if langCheck(e["owner_comment"]) == 1]
	shareBothLs = [e for e in shares if langCheck(e["owner_comment"]) == 2]

	statusEngLs = [e for e in status if langCheck(e["message"]) == 0]
	statusNonEngLs = [e for e in status if langCheck(e["message"]) == 1]
	statusBothLs = [e for e in status if langCheck(e["message"]) == 2]

	sample_data = {}
	post_count = 1
	for e in retrieveSample(commEngLs, shareEngLs, statusEngLs, limit, 0):
		sample_data["post" + str(post_count)] = e
		post_count += 1
	for e in retrieveSample(commNonEngLs, shareNonEngLs, statusNonEngLs, limit, 1):
		sample_data["post" + str(post_count)] = e
		post_count += 1
	for e in retrieveSample(commBothLs, shareBothLs, statusBothLs, limit, 2):
		sample_data["post" + str(post_count)] = e
		post_count += 1

	fout = open("page2.json", "w")
	fout.write(json.dumps(sample_data))
	fout.close()

comments_file = open("comments_test.html", "r")
comments_raw_data = comments_file.read()
comments_file.close()

comments_data = formatComments(comments_raw_data)

# shares data retrieved using
# "SELECT owner_comment, title, created_time, \
# link_id, url from link WHERE owner = me() \
# and owner_comment <> "";"
shares_file = open("shares.json", "r")
shares_raw_data = shares_file.read()
shares_file.close()

shares_data = json.loads(shares_raw_data)["data"]

# status data retrieved using
# "SELECT status_id, time, message FROM \
# status WHERE uid = me();"
status_file = open("status.json", "r")
status_raw_data = status_file.read()
status_file.close()

status_data = json.loads(status_raw_data)["data"]

outputData(comments_data, shares_data, status_data)
pickComments(comments_data, shares_data, status_data, 2)