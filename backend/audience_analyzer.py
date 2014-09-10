import bs4
import sys

def formatNames(data):
	soup = bs4.BeautifulSoup(data)
	n_ls = []
	for n in soup.find_all("div", class_="fsl fwb fcb"):
		n_ls.append(n.get_text())
	return n_ls

def load_lastnames():
	with open("common_korean_last_names.txt", "r") as f:
		lines = f.readlines()
	kor_lastnames = []
	for l in lines:
		kor_lastnames.append(l.lower()[:-1])

	with open("common_chinese_last_names.txt", "r") as f:
		lines = f.readlines()
	chi_lastnames = []
	for l in lines:
		chi_lastnames.append(l[:-1])

	return [kor_lastnames, chi_lastnames]

with open(sys.argv[1], "r") as f:
	data = f.read()
names = formatNames(data)
[korean_lastnames, chinese_lastnames] = load_lastnames()

korean_ls = []
chinese_ls = []

for n in names:
	if any(u'\uac00' <= ch <= u'\ud7af' for ch in n):
		korean_ls.append(n)
		continue

	if any(u'\u4e00' <= ch <= u'\u9fff' for ch in n):
		chinese_ls.append(n)
		continue

	lastname = n.split()[-1].lower()
	if lastname in korean_lastnames and \
		not lastname in chinese_lastnames:
		korean_ls.append(n)
		continue

	if lastname in chinese_lastnames and \
		not lastname in korean_lastnames:
		chinese_ls.append(n)
		continue

	if lastname in chinese_lastnames and \
		lastname in korean_lastnames:
		print n
		continue

	if n.split()[0].lower() in chinese_lastnames:
		chinese_ls.append(n)
		continue

print "Total: {} names; {} Korean; {} Chinese".format(\
		len(names), len(korean_ls), len(chinese_ls))
