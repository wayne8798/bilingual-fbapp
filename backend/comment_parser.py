import bs4

html_file = open("comments.html", "r")
soup = bs4.BeautifulSoup(html_file.read())
html_file.close()

test_out = open("test.out", "w")
for month in soup.find_all("div", class_="_iqp stat_elem"):
	print month["id"]
	for date in month.find_all("div", class_="pam _5ep8 uiBoxWhite bottomborder"):
		print date.get_text()
		for tr in date.parent.find_all("tr"):
			for td in tr.find_all("td"):
				info = td.find("div", class_="_42ef")
				if info != None:
					links = info.div.find_all("a") 
					if len(links) > 1:
						print links[1]
				msg = td.find("div", class_="fsm")
				if msg != None:
					print msg.get_text()
	# test_out.write(str(i.encode("utf8")))
test_out.close()