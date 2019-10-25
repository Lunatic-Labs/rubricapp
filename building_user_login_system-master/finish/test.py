from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys

#driver = webdriver.Ie("C:\\Users\\Owner\\PycharmProjects\\edusample\\building_user_login_system-master\\finish\\IEDriverServer.exe")
driver = webdriver.Chrome("C:\\Users\\Owner\\PycharmProjects\\edusample\\building_user_login_system-master\\finish\\chromedriver.exe")

#enter the main page
driver.set_page_load_timeout(10)
driver.get("http://google.com")

#driver.find_element_by_xpath("//*[contains(concat( ' ', @class, ' ' ), concat( ' ', 'gsfi', ' ' ))]").send_keys("here")
driver.find_element_by_name("q").send_keys("here")
