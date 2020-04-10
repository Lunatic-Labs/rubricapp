from scrapy.cmdline import execute

import sys
import os
# First run email_sender.py or send email through the web, then run email_testing to detect emails
execute(["scrapy", "crawl", "email_testing"])
