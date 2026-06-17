import urllib.request
import urllib.error

urls = [
    "http://127.0.0.1:5000/",
    "http://127.0.0.1:5000/login",
    "http://127.0.0.1:5000/register",
]

for url in urls:
    try:
        print(f"Requesting {url}...")
        response = urllib.request.urlopen(url)
        print(f"Success! Status code: {response.status}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error on {url}: {e.code} - {e.reason}")
    except urllib.error.URLError as e:
        print(f"URL Error on {url}: {e.reason}")
