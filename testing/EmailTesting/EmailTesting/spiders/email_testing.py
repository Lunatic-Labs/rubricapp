# -*- coding: utf-8 -*-
import scrapy

marker = "Testing1"


class EmailTestingSpider(scrapy.Spider):
    name = 'email_testing'
    allowed_domains = ['dispostable.com']

    start_urls = []
    for i in range(0, 21):
        email_address = 'https://www.dispostable.com/inbox/rubricapp-a{}/'.format(str(i))
        start_urls.append(email_address)

    def parse(self, response):
        content = response.xpath('//strong[contains(text(), "{}")]'.format(marker))
        if not content:
            url = response.url
            address_name = url.split("/")[-2]
            address_body = "@dispostable.com"
            address = address_name + address_body
            print("Email Address " + address + " did not receive the email!\n")