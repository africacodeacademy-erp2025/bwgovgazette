from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://127.0.0.1:8082/search")

        # Accept the cookie notice first
        try:
            accept_button = page.locator('button:has-text("Accept")')
            accept_button.wait_for(state='visible', timeout=10000)
            accept_button.click()
        except Exception as e:
            pass # Continue if it fails or isn't there

        # Wait for the search input to be visible and fill it
        search_input = page.locator('input[placeholder="Search gazettes..."]')
        search_input.wait_for(state='visible', timeout=30000)
        search_input.fill("tax")

        # Click the search button, using force=True
        search_button = page.locator('button:has-text("Search")')
        print("Attempting to click the search button with force=True...")
        search_button.click(force=True)
        print("Click action performed.")

        try:
            # Wait for the search results to appear
            results_container = page.locator('div:has-text("Search Summary")')
            results_container.wait_for(state='visible', timeout=15000) # Reduced timeout
            print("Search results found!")
        except Exception:
            print("Search results were not found.")

        # Take a screenshot of the final state
        page.screenshot(path="jules-scratch/verification/force_click_test.png")

        browser.close()

if __name__ == "__main__":
    run()
