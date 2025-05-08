// Course ID mapping from the API documentation
const courseIdMap = {
    'AI+ Executive™': 294,
    'AI+ Developer™': 296,
    'Blockchain+ Executive™': 298,
    'Bitcoin+ Developer™': 335,
    'AI+ Ethics™': 971,
    'AI+ Prompt Engineer™': 1067,
    'AI+ Sales™': 1069,
    'AI+ Marketing™': 1071,
    'AI+ Customer Service™': 1073,
    'AI+ Project Manager™': 1075,
    'AI+ Educator™': 1077,
    'AI+ Design™': 1079,
    'AI+ UX Designer™': 1081,
    'AI+ Learning & Development™': 1083,
    'AI+ Product Manager™': 1085,
    'AI+ Human Resources™': 1087,
    'AI+ Finance™': 1089,
    'AI+ Legal™': 1091,
    'AI+ Writer™': 1103,
    'AI+ Data™': 1108,
    'AI+ Engineer™': 1110,
    'AI+ Ethical Hacker™': 1114,
    'AI+ Cloud™': 1117,
    'AI+ Architect™': 1119,
    'AI+ Robotics™': 1123,
    'AI+ Quantum™': 1125,
    'Bitcoin+ Security™': 1127,
    'Blockchain+ Developer™': 1477,
    'Bitcoin+ Executive™': 1736,
    'AI+ Everyone™': 2317,
    'Bitcoin+ Everyone™': 2402,
    'AI+ Government™': 2518,
    'AI+ Healthcare™': 2520,
    'AI+ Researcher™': 3465,
    'AI+ Security Level 1™': 14790,
    'AI+ Security Compliance™': 14793,
    'AI+ Network™': 14798,
    'AI+ Supply Chain™': 14800,
    'AI+ Prompt Engineer 2™': 14803,
    'AI+ Security Level 2™': 14836,
    'AI+ Security Level 3™': 15262,
    'AI+ Chief AI Officer™': 25429,
    'AI+ Foundation™': 28178
};

// Get course ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const courseName = urlParams.get('course');

// Function to fetch course details from the API
async function fetchCourseDetails(courseId) {
    try {
        const response = await fetch(`https://www.aicerts.ai/wp-json/wp/v2/courses/${courseId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        return null;
    }
}

// Function to fetch course badge image
async function fetchCourseBadge(mediaId) {
    try {
        const response = await fetch(`https://www.aicerts.ai/wp-json/wp/v2/media/${mediaId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch course badge');
        }
        const data = await response.json();
        return data.source_url;
    } catch (error) {
        console.error('Error fetching course badge:', error);
        return null;
    }
}

// Function to update the course details in the UI
function updateCourseUI(courseData, badgeUrl) {
    // Title and code
    document.getElementById('courseTitle').textContent = courseData.title?.rendered || 'N/A';
    document.getElementById('courseCode').textContent = courseData.acf?.certificate_code || 'N/A';

    // Duration and level
    document.getElementById('courseDuration').textContent = courseData.acf?.duration || 'N/A';
    document.getElementById('courseLevel').textContent = courseData.acf?.level || 'N/A';

    // Prerequisites
    document.getElementById('coursePrerequisites').textContent = courseData.acf?.prerequisite || 'N/A';

    // Modules
    const modulesList = document.getElementById('courseModules');
    modulesList.innerHTML = '';
    if (Array.isArray(courseData.acf?.certification_module)) {
        courseData.acf.certification_module.forEach(module => {
            const li = document.createElement('li');
            li.textContent = module;
            modulesList.appendChild(li);
        });
    }

    // Tools
    const toolsGrid = document.getElementById('courseTools');
    toolsGrid.innerHTML = '';
    if (Array.isArray(courseData.acf?.tools)) {
        courseData.acf.tools.forEach(tool => {
            const toolDiv = document.createElement('div');
            toolDiv.className = 'tool-item';
            toolDiv.innerHTML = `
                <img src="${tool.tool_image}" alt="${tool.name}" class="tool-image">
                <h3>${tool.name}</h3>
            `;
            toolsGrid.appendChild(toolDiv);
        });
    }

    // Exam info
    document.getElementById('passingScore').textContent = courseData.acf?.passing_score || 'N/A';
    document.getElementById('numberOfMCQs').textContent = courseData.acf?.number_of_mcqs || 'N/A';
    document.getElementById('numberOfExams').textContent = courseData.acf?.number_of_examinations || 'N/A';
    document.getElementById('examObjectives').textContent = courseData.acf?.exam_objectives || 'N/A';

    // Badge
    if (badgeUrl) {
        document.getElementById('courseBadge').src = badgeUrl;
    }
}

// Main function to load course details
async function loadCourseDetails() {
    if (!courseName || !courseIdMap[courseName]) {
        console.error('Invalid course name');
        return;
    }

    const courseId = courseIdMap[courseName];
    const courseData = await fetchCourseDetails(courseId);
    
    if (courseData) {
        const badgeUrl = await fetchCourseBadge(courseData.featured_media);
        updateCourseUI(courseData, badgeUrl);
    }
}

// Load course details when the page loads
document.addEventListener('DOMContentLoaded', loadCourseDetails); 
