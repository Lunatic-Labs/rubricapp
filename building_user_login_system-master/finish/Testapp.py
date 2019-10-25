from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import demjson
import pickle

#driver = webdriver.Ie("C:\\Users\\Owner\\PycharmProjects\\edusample\\building_user_login_system-master\\finish\\IEDriverServer.exe")
driver = webdriver.Chrome("C:\\Users\\Owner\\PycharmProjects\\edusample\\building_user_login_system-master\\finish\\chromedriver.exe")

#enter the main page
driver.set_page_load_timeout(10)
driver.get("http://127.0.0.1:5000/")
#driver.maximize_window()
#driver.refresh()
driver.set_window_size(1120, 550)


cookiepath = "C:\\Users\\Owner\\PycharmProjects\\edusample\\building_user_login_system-master\\finish\\cookies.pkl"


#LOGIN
def login(username, password):
    driver.find_element_by_id("login").click()
    test = driver.find_element_by_name("test")
    print(test.get_attribute('value'))
    #driver.find_element_by_xpath("//*[(@id = 'username')]").send_keys("runqzhao")
    # driver.find_element_by_xpath("//*[(@id = 'password')]").send_keys("hengwujun527")
    username = driver.find_element_by_id("username")
    # username.send_keys("runqzhao")
    rightclick = ActionChains(driver)
    rightclick.move_to_element(test).perform()
    username.send_keys("runqzhao")
    password = driver.find_element_by_name("password")
    password.send_keys("hengwujun527")
    driver.find_element_by_name("submit").click()
    pickle.dump(driver.get_cookies(), open(cookiepath, "wb"))


def signup(username, email, password):
    driver.find_element_by_id("signup").click()
    driver.find_element_by_id("username").send_keys(username)
    driver.find_element_by_id("email").send_keys(email)
    driver.find_element_by_id("password").send_keys(password)
    driver.find_element_by_xpath()

def clickRubric():
    cookies = pickle.load(open(cookiepath, "rb"))
    for cookie in cookies:
        driver.add_cookie(cookie)
    driver.get("http://127.0.0.1:5000/instructor_dashboard")

def pickRubric(project_name):
    driver.get("http://127.0.0.1:5000/instructor_project")
    driver.find_element_by_name(project_name).click()

def createEvaluation(type, project, EvaluationName, EvaluationDesc):
    if type == "projectid":
        driver.get("http://127.0.0.1:5000/load_project/runqzhaorunqzhaometatest2full/Connect%20to%20Project%20Successfully")
    elif type == "projectname":
        pickRubric(project)
        Ele_evaname = driver.find_element_by_xpath("//*[(@id = 'evaluation_name')]")
        Ele_evaname.send_keys(EvaluationName)
        Ele_evadesc = driver.find_element_by_xpath("//*[(@id = 'evaluation_description')]")
        Ele_evadesc.send_keys(EvaluationDesc)
        Ele_button = driver.find_element_by_id("evaluation_submit")
        Ele_button.click()

def goTograde(EvaluationName, metaGroup):
    return

if __name__ == '__main__':
    #login("runqzhao", "hengwujun527")
    clickRubric()