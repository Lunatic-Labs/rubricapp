# -*- coding: utf-8 -*-
import scrapy

# Using scrapy to check if a contiguous number of email addresses receive the email with a marker, marker is usually the
# name of the evaluation, what's being commented out is another version that check dispostable addresses, to run this file
# run the main.py

marker = "TestEmail11"
failure_emails = []


class EmailTestingSpider(scrapy.Spider):
    name = 'email_testing'
    allowed_domains = ['mailnesia.com']
    start_urls = []
    for i in range(0, 200):
        email_address = 'http://mailnesia.com/mailbox/rubricapp-c{}'.format(str(i))
        start_urls.append(email_address)

    def parse(self, response):
        content = response.xpath('//tbody/tr/td[4]/a[contains(text(), "{}")]'.format(marker))

        if not content:
            url = response.url
            address_name = url.split("/")[-1]
            address_body = "@mailnesia.com"
            address = address_name + address_body
            failure_emails.append(address)
            print("\nEmail Address " + address + " did not receive the email!")
            print("total number of {} did not receive email".format(len(failure_emails)))
# class EmailTestingSpider(scrapy.Spider):
#     name = 'email_testing'
#     allowed_domains = ['dispostable.com']
#     start_urls = []
#     for i in range(0, 200):
#         email_address = 'https://www.dispostable.com/inbox/rubricapp-c{}/'.format(str(i))
#         start_urls.append(email_address)
#
#     def parse(self, response):
#         content = response.xpath('//strong[contains(text(), "{}")]'.format(marker))
#
#         if not content:
#             url = response.url
#             address_name = url.split("/")[-2]
#             address_body = "@dispostable.com"
#             address = address_name + address_body
#             failure_emails.append(address)
#             print("\nEmail Address " + address + " did not receive the email!")
#             print("total number of {} did not receive email".format(len(failure_emails)))

