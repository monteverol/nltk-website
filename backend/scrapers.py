import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import nltk
from nltk.tokenize import sent_tokenize

nltk.download('punkt')
nltk.download('punkt_tab')

# helper functions
# Simple NLTK-based summarizer that returns the first few sentences


def generate_summary(text, sentence_count=5):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    # Return the first few sentences as the summary
    return " ".join(sentences[:sentence_count])


def scrape_abs_cbn():
    # Initialize the Selenium WebDriver with WebDriver Manager
    options = Options()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Open the URL
    url = "https://news.abs-cbn.com/latest-news"
    driver.get(url)

    # Wait for the page to fully load
    time.sleep(1)  # Ensure the dynamic content is loaded

    # Get the cookies from the session
    cookies = driver.get_cookies()

    # Now that the page has loaded dynamically, get the page source
    page_source = driver.page_source

    # Use BeautifulSoup to parse the fully rendered HTML
    soup = BeautifulSoup(page_source, "html.parser")

    # Function to extract and return the news data from a section
    def extract_news(section, title_class, link_class, title_tag="h5", link_tag="a"):
        news = []
        for element in section:
            title = element.find(title_tag, class_=title_class)
            link = element.find(link_tag, class_=link_class)
            if title and link and link['href']:
                news.append({
                    "title": title.text.strip(),
                    "link": link['href'],
                    "paragraphs": "",  # Placeholder for the paragraphs
                    "summary": "",  # Placeholder for the summary we'll generate later
                    "tags": [],
                    "date": ""  # Placeholder for the date we'll extract later
                })
        return news

    # Latest News Section
    latest_news_section = soup.find_all(
        "div", class_="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-4 MuiGrid-grid-lg-4 css-1i58t6r")
    latest_news = extract_news(latest_news_section, "MuiTypography-root MuiTypography-h5 MuiTypography-gutterBottom jss2 css-k1kq6q",
                               "MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineNone css-cs6pc5")

    # More News Section
    more_news_section = soup.find_all(
        "div", class_="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-4 MuiGrid-grid-md-4 MuiGrid-grid-lg-3 css-1e9kidy")
    more_news = extract_news(more_news_section, "MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom jss3 css-izavx0",
                             "MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineNone css-cs6pc5", title_tag="h4")

    # Combine both sections and remove duplicates based on the title
    combined_news = {item['title']: item for item in (
        latest_news + more_news)}.values()

    # Fetch, extract paragraphs, and update summaries for each news article
    for news_item in combined_news:
        article_url = f"https://news.abs-cbn.com{news_item['link']}"
        try:
            # Open the article page using cookies from the first session
            # First, go to the main page
            driver.get("https://news.abs-cbn.com")
            for cookie in cookies:  # Add cookies to the new page
                driver.add_cookie(cookie)

            driver.get(article_url)  # Then go to the specific article URL
            time.sleep(1)  # Ensure the page is fully loaded

            # Extract the article content
            article_page = driver.page_source
            article_soup = BeautifulSoup(article_page, "html.parser")

            # Assuming the news article is inside <p> tags. Adjust according to actual HTML structure.
            paragraphs = article_soup.find_all('p')
            article_text = " ".join([p.get_text() for p in paragraphs])

            # Update the news item with the full article text
            news_item['paragraphs'] = article_text

            # Extract the tags
            tags = article_soup.find(
                "h3", class_="MuiTypography-root MuiTypography-h3 css-k0a0j1")
            news_item['tags'] = [tags.get_text()]

            # Also use POS tagging here and add to tags

            # Extract the date
            date_element = article_soup.find("span", itemprop="datePublished")
            print(date_element)
            if date_element:
                # Extract the date content attribute
                news_item['date'] = date_element['content']

            # Generate summary using NLTK and update the news item
            summary = generate_summary(article_text)
            news_item['summary'] = summary  # Update the summary field

        except Exception as e:
            print(f"Error fetching article {article_url}: {e}")
            news_item['summary'] = "Summary unavailable"  # Handle error cases

    # Now combined_news will have the updated paragraphs and summaries for each news article.

    # Extract tags from divs with class 'MuiGrid-root MuiGrid-item css-1t0fio2'
    tags_section = soup.find_all(
        "div", class_="MuiGrid-root MuiGrid-item css-1t0fio2")

    # Extract tags from divs with class 'MuiBox-root css-1oonbm0'
    tags_columns = soup.find_all("div", class_="MuiBox-root css-1oonbm0")

    tags = []
    # Loop through tags_section and extract anchor elements
    for div in tags_section:
        tag_link = div.find(
            "a", class_="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineNone css-cs6pc5")
        if tag_link and tag_link['href'] and not tag_link.text.isupper():
            tags.append({
                "tag": tag_link.text.strip(),
                "link": tag_link['href']
            })

    # Loop through tags_columns and extract anchor elements
    for div in tags_columns:
        tag_link = div.find(
            "a", class_="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineNone css-cs6pc5")
        if tag_link and tag_link['href'] and not tag_link.text.isupper():
            tags.append({
                "tag": tag_link.text.strip(),
                "link": tag_link['href']
            })

    # Convert the combined news and additional tag data to JSON format
    driver.quit()  # Close the browser once done

    # Return both news data and extracted tags
    return {
        "news": list(combined_news),
        "tags": tags
    }


def scrape_gma():
    # Initialize the Selenium WebDriver with WebDriver Manager
    options = Options()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Open the URL
    url = "https://www.gmanetwork.com/news/topstories/"
    driver.get(url)

    # Wait for the page to fully load
    time.sleep(1)

    # Get the page source
    page_source = driver.page_source

    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the latest news articles
    top_news = soup.find_all("a", class_="story_link story")

    news = []  # List to store the news data
    tags = []  # Placeholder for tags (empty)

    # Extract each article
    for news_item in top_news:
        title = news_item.get_text(strip=True)
        link = news_item['href']

        # Visit the article page
        full_link = f"{link}"
        driver.get(full_link)
        time.sleep(1)  # Ensure the page is fully loaded

        # Parse the article page
        article_page = driver.page_source
        article_soup = BeautifulSoup(article_page, "html.parser")

        # Assuming paragraphs are inside <p> tags
        paragraphs = article_soup.find_all('p')
        article_text = " ".join([p.get_text() for p in paragraphs])

        # Generate summary using NLTK
        summary = generate_summary(article_text)

        # Extract the publication date from the datetime attribute
        date_element = article_soup.find("time", itemprop="datePublished")
        date = date_element['datetime'] if date_element else "No date available"

        # Append the news data including empty tags field
        news.append({
            "title": title,
            "link": full_link,
            "paragraphs": article_text,  # Full article text
            "summary": summary,  # Generated summary
            "date": date,  # Extracted date
        })

    driver.quit()  # Close the browser once done

    # Return both news data and the tags (empty for now)
    return {
        "news": news,
        "tags": tags
    }


def scrape_manila_times():
    # Initialize the Selenium WebDriver with WebDriver Manager
    options = Options()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Open the URL
    url = "https://www.manilatimes.net/"
    driver.get(url)

    # Wait for the page to fully load
    time.sleep(1)  # Increase sleep time for better loading if necessary

    # Get the page source
    page_source = driver.page_source

    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the latest news articles
    latest_news_section = soup.find(
        "div", class_="widget-container hp-latest-stories")
    latest_news_items = latest_news_section.find_all("a", class_="col-img-1")

    news = []  # List to store the news data
    tags = []  # Placeholder for tags (empty)

    # Extract each article
    for news_item in latest_news_items:
        # Extract title from the 'title' attribute
        title = news_item.get('title', '').strip()
        link = news_item['href']  # Extract the href for the link

        # Visit the article page
        full_link = f"{link}"
        driver.get(full_link)
        time.sleep(1)  # Ensure the page is fully loaded

        # Parse the article page
        article_page = driver.page_source
        article_soup = BeautifulSoup(article_page, "html.parser")

        # Assuming paragraphs are inside <p> tags
        paragraphs = article_soup.find_all('p')
        article_text = " ".join([p.get_text() for p in paragraphs])

        # Generate summary using NLTK
        summary = generate_summary(article_text)

        # Extract the publication date from the datetime attribute if available
        date_element = article_soup.find(
            "div", class_="article-publish-time roboto-a")
        date = date_element.get_text(
            strip=True) if date_element else "No date available"

        # Append the news data including empty tags field
        news.append({
            "title": title,
            "link": full_link,
            "paragraphs": article_text,  # Full article text
            "summary": summary,  # Generated summary
            "date": date,  # Extracted date
        })

    driver.quit()  # Close the browser once done

    # Return both news data and the tags (empty for now)
    return {
        "news": news,
        "tags": tags
    }


def scrape_philstar():
    # Initialize the Selenium WebDriver with WebDriver Manager
    options = Options()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Open the URL
    url = "https://www.philstar.com/"
    driver.get(url)

    # Wait for the page to fully load
    time.sleep(1)  # Increase sleep time for better loading if necessary

    # Get the page source
    page_source = driver.page_source

    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the latest news articles within the <div> with class 'ribbon_title'
    latest_news_items = soup.find_all("div", class_="ribbon_title")

    news = []  # List to store the news data
    tags = []  # Placeholder for tags (empty)

    for news_item in latest_news_items:
        # Find the <a> tag inside the <h2> tag and extract the link and title
        link_tag = news_item.find("a")
        if link_tag:
            title = link_tag.text.strip()  # Extract title from the text inside <a>
            link = link_tag['href']  # Extract the href attribute for the link

            # # Visit the article page
            full_link = f"{link}"
            driver.get(full_link)
            time.sleep(1)  # Ensure the page is fully loaded

            # Parse the article page
            article_page = driver.page_source
            article_soup = BeautifulSoup(article_page, "html.parser")

            # Assuming paragraphs are inside <p> tags
            paragraphs = article_soup.find_all('p')
            article_text = " ".join([p.get_text() for p in paragraphs])

            # # Generate summary using NLTK
            summary = generate_summary(article_text)

            # date_element = article_soup.find("div", class_="article__date-published")
            # date = date_element.get_text().strip() if date_element else "No date available"

            # Append the news data to the list
            news.append({
                "title": title,
                "link": full_link,
                "paragraphs": article_text,  # Full article text
                "summary": summary,  # Generated summary
                "date": "",  # Extracted date
            })

    driver.quit()  # Close the browser once done

    # Return both news data and the tags (empty for now)
    return {
        "news": news,
        "tags": tags
    }

def scrape_rappler():
    # Initialize the Selenium WebDriver with WebDriver Manager
    options = Options()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()), options=options)

    # Open the URL
    url = "https://www.rappler.com/latest/"
    driver.get(url)

    # Wait for the page to fully load
    time.sleep(1)  # Ensure the page is fully loaded

    # Get the page source
    page_source = driver.page_source

    # Use BeautifulSoup to parse the HTML
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the latest news articles within the <article> tags
    latest_news_section = soup.find("main", class_="site-main container")
    latest_news_items = latest_news_section.find_all("article")

    news = []  # List to store the news data
    tags = []  # Placeholder for tags (empty)

    # Extract each article
    for news_item in latest_news_items:
        # Extract the title and link from the <h2> and <a> tag
        title_tag = news_item.find("h2")
        if title_tag:
            title_element = title_tag.find("a")
            if title_element:
                title = title_element.get_text(strip=True)  # Extract the title
                link = title_element['href']  # Extract the link

                # Visit the article page
                driver.get(link)
                time.sleep(1)  # Ensure the article page is fully loaded

                # Parse the article page
                article_page = driver.page_source
                article_soup = BeautifulSoup(article_page, "html.parser")

                # Assuming paragraphs are inside <p> tags
                paragraphs_container = article_soup.find('div', class_="post-single__content entry-content")
                paragraphs = paragraphs_container.find_all('p')
                article_text = " ".join([p.get_text() for p in paragraphs]).get_text()

                # Generate summary using NLTK
                summary = article_soup.find("div", class_="post-single__summary").get_text()

                # Extract the publication date from the <time> tag
                date_element = article_soup.find("time")
                date = date_element['datetime'] if date_element else "No date available"

                # Append the news data to the list
                news.append({
                    "title": title,
                    "link": link,
                    "paragraphs": article_text,  # Full article text
                    "summary": summary,  # Generated summary
                    "date": date,  # Extracted date
                })

    driver.quit()  # Close the browser once done

    # Return both news data and the tags (empty for now)
    return {
        "news": news,
        "tags": tags
    }
