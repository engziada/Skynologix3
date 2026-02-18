from playwright.sync_api import sync_playwright

def test_scroll_behavior(page):
    page.goto("http://localhost:8000")
    page.wait_for_load_state("networkidle")
    page.evaluate("window.scrollTo(0, 500)")
    page.wait_for_timeout(500)
    page.screenshot(path="verification/scrolled.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_scroll_behavior(page)
        finally:
            browser.close()
