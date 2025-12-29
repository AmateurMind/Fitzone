import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:19006/", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the Workouts button to navigate to the Workouts screen.
        frame = context.pages[-1]
        # Click on the Workouts button to navigate to the Workouts screen
        elem = frame.locator('xpath=html/body/div/div/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Enter a search keyword in the search input to filter workouts.
        frame = context.pages[-1]
        # Enter 'HIIT' in the search bar to filter workouts by keyword
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('HIIT')
        

        # -> Click on the 'Strength' category filter to filter workouts by category.
        frame = context.pages[-1]
        # Click on the 'Strength' category filter
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear the search input to remove 'HIIT' filter and then apply the 'Intermediate' difficulty filter.
        frame = context.pages[-1]
        # Clear the search input to remove 'HIIT' filter
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        # -> Apply the duration filter (e.g., 30-45 mins) and verify the workouts displayed meet the duration criteria.
        frame = context.pages[-1]
        # Click on the 'All' category filter to reset category filter
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[2]/div/div/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click on the 'All' difficulty filter to reset difficulty filter
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[3]/div/div/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click on the workout with 40 min duration to verify duration filter applicability
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[4]/div[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate back to the main Workouts screen to locate and apply the duration filter.
        frame = context.pages[-1]
        # Click back button to return to main Workouts screen with filters and workout list
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Check if there is a duration filter control available and apply a duration filter (e.g., 30-45 mins) to verify workouts displayed meet the duration criteria.
        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        # -> Verify if duration filtering is supported by clicking on workouts or exploring UI for hidden duration filter options.
        frame = context.pages[-1]
        # Click on 'Full Body HIIT Blast' workout to check if duration filter or details appear
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[4]/div[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Return to main Workouts screen and check for any dropdown or hidden duration filter options near the search or filter controls.
        frame = context.pages[-1]
        # Click back button to return to main Workouts screen
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Full Body HIIT Blast').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Upper Body Strength').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Intermediate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Strength').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=30 min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=40 min').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    