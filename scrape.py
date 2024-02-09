import sys
import time
from selenium import webdriver
import undetected_chromedriver as uc
from fake_useragent import UserAgent
import chromedriver_autoinstaller_fix
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import requests
import json

# Define the URL of the API endpoint
add_subway_url = "http://localhost:5001/subways/"

chromedriver_autoinstaller_fix.install()

options = webdriver.ChromeOptions()
options.add_argument(f"user-agent={UserAgent.random}")
driver = uc.Chrome(options=options)

driver.get("https://subway.com.my/find-a-subway")
wait = WebDriverWait(driver, 10)

search_input = wait.until(
    EC.presence_of_element_located(
        (
            By.XPATH,
            '//*[@id="fp_searchAddress"]',
        )
    )
)
search_input.send_keys("Kuala Lumpur")

search_button = wait.until(
    EC.presence_of_element_located(
        (
            By.XPATH,
            '//*[@id="fp_searchAddressBtn"]',
        )
    )
)
search_button.click()

html = BeautifulSoup(driver.page_source, "html.parser")
subway_items = html.find_all("div", class_="fp_listitem")

for subway_item in subway_items:
    latitude = subway_item["data-latitude"]
    longitude = subway_item["data-longitude"]
    name = subway_item.find("h4").text
    address = subway_item.find("p").text
    direction_button = subway_item.find("div", class_="directionButton")
    waze_link = direction_button.find_all("a", href=True)[1]["href"]
    infoboxcontent = subway_item.find("div", class_="infoboxcontent")
    business_hours = subway_item.find_all("p")[2:-2]
    business_hours = [
        business_hour.text.replace("\xa0", " ") for business_hour in business_hours
    ]
    business_hours_str = "; ".join(business_hours)

    data = {
        "name": name,
        "address": address,
        "waze": waze_link,
        "lat": float(latitude),
        "lng": float(longitude),
        "BusinessHourText": business_hours_str,
    }

    response = requests.post(add_subway_url, data=json.dumps(data))
    if response.status_code == 200:
        print("Subway added successfully")
    else:
        print("Failed to add subway")


driver.quit()
