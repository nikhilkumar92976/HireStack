const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const resumeAnalysisSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateResumeAnalysisReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interviewer AI.

Analyze the candidate profile and generate an interview preparation report.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

You MUST return ONLY valid JSON.

IMPORTANT RULES:

1. The response must be STRICT JSON.
2. Do NOT flatten arrays.
3. Arrays must contain OBJECTS.
4. Do NOT return keys and values as separate strings.
5. Every question must be an object with question, intention, and answer.

Correct Example: 

{
  "title": "Full Stack Developer Interview Report",
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Explain how JWT authentication works in a Node.js application.",
      "intention": "Test backend authentication knowledge",
      "answer": "Explain login flow, token generation, verification middleware, and security best practices."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a difficult bug you solved.",
      "intention": "Assess debugging skills",
      "answer": "Use STAR method and explain the debugging process clearly."
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Data Structures",
      "tasks": [
        "Solve array problems",
        "Practice two pointer technique"
      ]
    }
  ]
}

Now generate the report for the candidate.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeAnalysisSchema),
        }
    })

    const cleanText = response.text.replace(/```json|```/g, "").trim()

    return JSON.parse(cleanText)

}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
} 

async function generateResumePdf({name, email, phone, location, github, linkedin, summary,  skills,workHistory,projects, education,Achievements,HonorsAndAwards, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a professional resume for the candidate with the following details:
                        Job Description: ${jobDescription}
                        Personal Details:
                        - Name: ${name || 'Not provided'}
                        - Email: ${email || 'Not provided'}
                        - Phone: ${phone || 'Not provided'}
                        - Location: ${location || 'Not provided'}
                        - GitHub: ${github || 'Not provided'}
                        - LinkedIn: ${linkedin || 'Not provided'}
                        Summary: ${summary || 'Not provided'}
                        Skills: ${skills || 'Not provided'}
                        Work History: ${workHistory || 'Not provided'}
                        Projects: ${projects || 'Not provided'}
                        Education: ${education || 'Not provided'}
                        Achievements: ${Achievements || 'Not provided'}
                        Honors and Awards: ${HonorsAndAwards || 'Not provided'}

                        If any section data is undefined or empty, remove that section from the resume.
                        The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The resume should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        Include the personal details (name, contact info, links) at the top of the resume in a professional header format.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const responseText =
        typeof response.text === "string"
            ? response.text
            : JSON.stringify(response.text)

    // Some models return JSON wrapped in markdown code fences, so strip them.
    const cleanText = responseText
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim()

    let jsonContent
    try {
        jsonContent = JSON.parse(cleanText)
    } catch (err) {
        throw new Error(
            `Failed to parse OpenAI response as JSON. responseText=${responseText.slice(0, 500)}`
        )
    }

    if (!jsonContent || typeof jsonContent.html !== "string") {
        throw new Error("AI response did not contain a valid 'html' field")
    }

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateResumeAnalysisReport, generateResumePdf }