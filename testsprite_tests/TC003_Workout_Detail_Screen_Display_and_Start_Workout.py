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
        # -> Click on the 'Workouts' tab to navigate to the Workouts Screen to select a workout.
        frame = context.pages[-1]
        # Click the 'Workouts' tab to go to the Workouts Screen
        elem = frame.locator('xpath=html/body/div/div/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Select the 'Core Crusher' workout to view its details.
        frame = context.pages[-1]
        # Select the 'Core Crusher' workout from the list
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div/div/div[4]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Start AI Voice-Guided Workout' button to initiate the workout session.
        frame = context.pages[-1]
        # Click the 'Start AI Voice-Guided Workout' button to start the workout session
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div[2]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Start Workout' button to initiate the workout session and verify the tracking interface appears without errors.
        frame = context.pages[-1]
        # Click the 'Start Workout' button to initiate the workout session
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div/div[2]/div/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Advanced').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Core Crusher').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=with Neha Singh').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=20 min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=180').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=High intensity interval training designed to burn maximum calories and build lean muscle. This full-body workout combines cardio and strength exercises for a complete fitness session.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mat').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dumbbells').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Water').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Warm Up').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3 min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Jumping Jacks').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=60 sec').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Squats').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15 reps').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Push Ups').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12 reps').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Burpees').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=45 sec').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Plank Hold').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=60 sec').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cool Down').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3 min').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start AI Voice-Guided Workout').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    