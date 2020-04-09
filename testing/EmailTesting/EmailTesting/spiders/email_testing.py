# -*- coding: utf-8 -*-
import scrapy



class EmailtestingSpider(scrapy.Spider):
    name = 'emailTesting'
    allowed_domains = ['email.com']
    start_urls = ['http://email.com/']

    def parse(self, response):
        pass
