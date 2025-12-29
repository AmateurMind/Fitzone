// Test Plan Saving Flow
// Open browser console and paste this to test

async function testPlanSaving() {
    console.log('=== TESTING PLAN SAVING ===');
    
    // 1. Import functions (if in browser, these are already loaded)
    const { saveUserPlan, getUserPlans } = window.firestoreService || {};
    const { getCurrentUserId } = window.authService || {};
    
    if (!saveUserPlan || !getUserPlans || !getCurrentUserId) {
        console.error('❌ Services not available. Run this in the app context.');
        return;
    }
    
    try {
        // 2. Get user ID
        const userId = getCurrentUserId();
        console.log('✅ User ID:', userId);
        
        // 3. Create test plan
        const testPlan = {
            type: 'workout',
            planName: 'Test Workout Plan',
            plan: {
                planName: 'Test Workout Plan',
                summary: 'This is a test plan to verify saving works',
                weeklySchedule: [
                    { day: 'Monday', workout: 'Upper Body', focus: 'Chest, Arms', duration: 30, type: 'Strength' },
                    { day: 'Tuesday', workout: 'Cardio', focus: 'Full Body', duration: 25, type: 'Cardio' },
                    { day: 'Wednesday', workout: 'Rest', focus: 'Recovery', duration: 0, type: 'Rest' }
                ],
                tips: [
                    'Stay hydrated',
                    'Warm up properly',
                    'Get enough sleep'
                ],
                expectedResults: 'In 4 weeks, expect improved fitness'
            },
            preferences: { goal: 'Test', level: 'Beginner' },
            status: 'active'
        };
        
        // 4. Save plan
        console.log('💾 Saving test plan...');
        const savedPlan = await saveUserPlan(userId, testPlan);
        console.log('✅ Plan saved with ID:', savedPlan.id);
        
        // 5. Fetch plans
        console.log('📥 Fetching all plans...');
        const allPlans = await getUserPlans(userId);
        console.log('✅ Fetched plans:', allPlans.length);
        console.log('Plans:', allPlans);
        
        // 6. Verify our test plan is there
        const foundPlan = allPlans.find(p => p.planName === 'Test Workout Plan');
        if (foundPlan) {
            console.log('✅ SUCCESS! Test plan found:', foundPlan.planName);
        } else {
            console.error('❌ FAILED! Test plan not found in results');
        }
        
        console.log('\n=== TEST COMPLETE ===');
        console.log('If you see ✅ SUCCESS above, plan saving is working!');
        console.log('Now go to "My Plans" screen and click refresh 🔄');
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error);
        console.log('Error details:', error.message);
    }
}

// Run the test
testPlanSaving();

