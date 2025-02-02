<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supplement Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-4">
    <div class="max-w-3xl mx-auto">
        <!-- Daily Supplements -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
            <h2 class="text-xl font-bold mb-4">Daily Supplements</h2>
            <div class="space-y-3" id="dailySupplements">
            </div>
        </div>

        <!-- GI Cleanse -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">GI Cleanse</h2>
                <div>
                    <button id="startCleanse" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Start Cleanse</button>
                    <button id="nextWeek" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hidden">Next Week</button>
                </div>
            </div>
            <p id="weekCounter" class="mb-4 font-semibold">Not Started</p>
            <div id="giCleanse" class="space-y-3">
            </div>
        </div>

        <!-- EFAS Rotation -->
        <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">EFAS Rotation</h2>
                <button id="nextDay" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Next Day</button>
            </div>
            <div id="efasRotation" class="space-y-3">
            </div>
        </div>
    </div>

    <script>
        const dailySupps = [
            { name: "MY Complex MK", timing: "With breakfast", dose: "2 capsules" },
            { name: "Liposomal Nicotinamide Riboside", timing: "AM with food", dose: "1 capsule" },
            { name: "Glycine Powder", timing: "Any time (nice before bed)", dose: "½ teaspoon in warm water" },
            { name: "Liposomal glutathione", timing: "Every morning", dose: "1 capsule daily x 4 months, then 2x per week" },
            { name: "Similase Sensitive Stomach", timing: "With each meal", dose: "1 capsule" }
        ];

        const giCleanseSupps = [
            { name: "Caprylic acid", timing: "Before bed", dose: "2 capsules" },
            { name: "Atranil Pro", timing: "With food", dose: "1 capsule 3x daily" },
            { name: "Full spectrum binder", timing: "Before bed", dose: "1-2 capsules" }
        ];

        const postCleanseSupps = [
            { name: "Therbiotic complete Probiotic", timing: "Daily with food", dose: "1 capsule", note: "Start after 8-week cleanse" }
        ];

        const efasSupps = [
            { name: "Fish Oil", day: 1, dose: "Current formula" },
            { name: "Flax Oil", day: 2, dose: "1 tablespoon" },
            { name: "Evening Primrose Oil", day: 3, dose: "1 teaspoon" }
        ];

        let currentDay = 1;
        let currentWeek = 0;
        let cleanseStarted = false;

        try {
            const savedDay = sessionStorage.getItem('currentDay');
            const savedCleanseStarted = sessionStorage.getItem('cleanseStarted');
            const savedWeek = sessionStorage.getItem('currentWeek');

            if (savedDay) currentDay = parseInt(savedDay);
            if (savedCleanseStarted) {
                cleanseStarted = savedCleanseStarted === 'true';
            }
            if (savedWeek) {
                currentWeek = parseInt(savedWeek);
            }
        } catch (error) {
            console.log('No saved state available');
        }

        function renderDailySupps() {
            const container = document.getElementById('dailySupplements');
            container.innerHTML = dailySupps.map(supp => `
                <div class="p-3 rounded-lg border border-yellow-300 bg-yellow-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">${supp.name}</h3>
                            <p class="text-sm text-gray-600">${supp.dose}</p>
                        </div>
                        <div class="text-sm text-gray-600">${supp.timing}</div>
                    </div>
                </div>
            `).join('');
        }

        function renderGICleanse() {
            const container = document.getElementById('giCleanse');
            const supps = cleanseStarted ? giCleanseSupps : postCleanseSupps;
            container.innerHTML = supps.map(supp => `
                <div class="p-3 rounded-lg border ${cleanseStarted ? 'border-blue-300 bg-blue-50' : 'border-green-300 bg-green-50'}">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">${supp.name}</h3>
                            <p class="text-sm text-gray-600">${supp.dose}</p>
                            ${supp.note ? `<p class="text-xs text-gray-500">${supp.note}</p>` : ''}
                        </div>
                        <div class="text-sm text-gray-600">${supp.timing}</div>
                    </div>
                </div>
            `).join('');
        }

        function renderEFAS() {
            const container = document.getElementById('efasRotation');
            container.innerHTML = efasSupps.map((supp, index) => `
                <div class="p-3 rounded-lg border ${currentDay === supp.day ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'}">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">${supp.name}</h3>
                            <p class="text-sm text-gray-600">Day ${supp.day}</p>
                        </div>
                        <div class="text-sm text-gray-600">${supp.dose}</div>
                    </div>
                </div>
            `).join('');
        }

        document.getElementById('nextDay').addEventListener('click', () => {
            currentDay = currentDay === 3 ? 1 : currentDay + 1;
            renderEFAS();
            try {
                sessionStorage.setItem('currentDay', currentDay);
            } catch (error) {
                console.log('Could not save state');
            }
        });

        document.getElementById('startCleanse').addEventListener('click', () => {
            cleanseStarted = true;
            currentWeek = 1;
            document.getElementById('startCleanse').classList.add('hidden');
            document.getElementById('nextWeek').classList.remove('hidden');
            document.getElementById('weekCounter').textContent = `Week ${currentWeek} of 8`;
            renderGICleanse();
            try {
                sessionStorage.setItem('cleanseStarted', true);
                sessionStorage.setItem('currentWeek', currentWeek);
            } catch (error) {
                console.log('Could not save state');
            }
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            if (currentWeek < 8) {
                currentWeek++;
                document.getElementById('weekCounter').textContent = `Week ${currentWeek} of 8`;
            } else {
                cleanseStarted = false;
                currentWeek = 0;
                document.getElementById('startCleanse').classList.remove('hidden');
                document.getElementById('nextWeek').classList.add('hidden');
                document.getElementById('weekCounter').textContent = 'Cleanse Complete';
            }
            renderGICleanse();
            try {
                sessionStorage.setItem('cleanseStarted', cleanseStarted);
                sessionStorage.setItem('currentWeek', currentWeek);
            } catch (error) {
                console.log('Could not save state');
            }
        });

        // Initial render
        if (cleanseStarted) {
            document.getElementById('startCleanse').classList.add('hidden');
            document.getElementById('nextWeek').classList.remove('hidden');
            document.getElementById('weekCounter').textContent = `Week ${currentWeek} of 8`;
        }
        renderDailySupps();
        renderGICleanse();
        renderEFAS();
    </script>
</body>
</html>