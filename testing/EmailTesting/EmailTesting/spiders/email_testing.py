# -*- coding: utf-8 -*-
import scrapy

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

