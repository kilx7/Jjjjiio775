let myChart = null;

const adviceList = {
    نحافة: {
        parent: [
            "1. زيادة عدد الوجبات إلى 5-6 وجبات يومية",
            "2. إضافة زيت الزيتون إلى الأطعمة",
            "3. مراجعة أخصائي تغذية",
            `<a href="https://example.com/underweight" target="_blank">نصائح إضافية</a>`
        ],
        teacher: [
            "1. مراقبة تغذية الطفل في المدرسة",
            "2. توفير وجبات خفيفة صحية",
            "3. التواصل مع الأهل",
            `<a href="https://example.com/underweight-teacher" target="_blank">مراجع للمعلمين</a>`
        ]
    },
    مثالي: {
        parent: ["🎉 حافظ على النظام الغذائي الصحي!"],
        teacher: ["🏆 شجع التلاميذ على الاستمرار!"]
    },
    "زيادة وزن": {
        parent: [
            "1. تقليل العصائر المحلاة",
            "2. ممارسة الرياضة الجماعية",
            "3. استبدال المقليات بالمسلوق",
            `<a href="https://example.com/overweight" target="_blank">نصائح إضافية</a>`
        ],
        teacher: [
            "1. تنظيم أنشطة رياضية إضافية",
            "2. توعية حول الوجبات المدرسية",
            "3. إشراك الأهل",
            `<a href="https://example.com/overweight-teacher" target="_blank">مراجع للمعلمين</a>`
        ]
    },
    "سمنة مفرطة": {
        parent: [
            "1. مراجعة طبيب أطفال فورية",
            "2. تحديد وقت الشاشات إلى ساعة يوميًا",
            "3. مشاركة الأسرة في الأنشطة",
            `<a href="https://example.com/obese" target="_blank">نصائح إضافية</a>`
        ],
        teacher: [
            "1. تنظيم ورش عمل عن السمنة",
            "2. مراقبة المقاصف المدرسية",
            "3. التعاون مع المختصين",
            `<a href="https://example.com/obese-teacher" target="_blank">مراجع للمعلمين</a>`
        ]
    }
};

const bmiData = {
    female: {
        2: [14.3, 16.2, 17.5, 19.1],
        5: [13.8, 15.8, 17.1, 19.7],
        10: [14.2, 16.3, 18.2, 21.9],
        18: [18.5, 24.9, 29.9, 40]
    },
    male: {
        2: [14.8, 16.8, 18.1, 19.8],
        5: [14.4, 16.5, 18.4, 20.7],
        10: [15.1, 17.2, 19.8, 24.0],
        18: [18.5, 24.9, 29.9, 40]
    }
};

function getReferenceData(age, gender) {
    const ages = Object.keys(bmiData[gender]).sort((a, b) => a - b);
    const closestAge = ages.reduce((prev, curr) =>
        Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
    );
    return bmiData[gender][closestAge];
}

function updateChart(bmi) {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    const age = parseInt(document.getElementById('age').value);
    const gender = 'male'; // يمكن إضافة حقل اختيار الجنس في الـ HTML
    
    if (myChart) myChart.destroy();
    
    const refData = getReferenceData(age, gender);
    const labels = ['نحافة شديدة', 'نحافة', 'مثالي', 'زيادة وزن', 'سمنة مفرطة'];
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'المعدلات المرجعية',
                data: refData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: '#2563eb',
                pointHoverRadius: 8,
                fill: true
            }, {
                label: 'نتيجة الطفل',
                data: Array(refData.length).fill(bmi),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderDash: [5, 5],
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'مقارنة النتيجة مع المعدلات العمرية',
                    font: { 
                        size: 18,
                        weight: 'bold',
                        family: 'Tajawal'
                    },
                    padding: { bottom: 15 }
                },
                legend: {
                    position: 'top',
                    align: 'start',
                    rtl: true,
                    labels: { 
                        font: { 
                            size: 14,
                            family: 'Tajawal'
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    rtl: true,
                    titleFont: { family: 'Tajawal' },
                    bodyFont: { family: 'Tajawal' },
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            return `${label}: ${context.raw} BMI`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { 
                        display: true, 
                        text: 'مؤشر كتلة الجسم (BMI)',
                        font: { size: 14, family: 'Tajawal' }
                    },
                    grid: { color: '#e2e8f0' }
                },
                x: {
                    ticks: { 
                        font: { 
                            size: 14, 
                            family: 'Tajawal' 
                        }
                    },
                    grid: { display: false }
                }
            },
            elements: {
                line: {
                    tension: 0.3
                }
            },
            rtl: true
        }
    });
}

function calculateBMI() {
    const age = parseInt(document.getElementById('age').value);
    if (age > 18 || age < 2) {
        alert("الرجاء إدخال عمر بين 2 و 18 سنة!");
        return;
    }

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        alert("الرجاء إدخال قيم صحيحة!");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters ** 2)).toFixed(1);
    
    showResult(bmi);
    updateChart(bmi);
}

function getCategory(bmi) {
    if (bmi < 16) return 'نحافة';          // نحافة شديدة
    if (bmi < 18.5) return 'نحافة';       // نحافة عادية
    if (bmi < 25) return 'مثالي';
    if (bmi < 30) return 'زيادة وزن';
    return 'سمنة مفرطة';
}

function showResult(bmi) {
    const userType = document.getElementById('userType').value;
    const category = getCategory(parseFloat(bmi));
    const resultDiv = document.getElementById('result');
    const adviceDiv = document.getElementById('advice');
    
    if (!adviceList[category]) {
        alert("خطأ في تحليل النتائج!");
        return;
    }

    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('active');
    
    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('resultTitle').textContent = category;

    const adviceItems = adviceList[category][userType];
    adviceDiv.innerHTML = adviceItems.map(item => `
        <div class="advice-item">${item}</div>
    `).join('');

    if (category === 'مثالي') showCelebration();
}

function showCelebration() {
    const celebration = document.getElementById('celebration');
    celebration.style.display = 'block';
    setTimeout(() => {
        celebration.style.display = 'none';
    }, 3000);
}