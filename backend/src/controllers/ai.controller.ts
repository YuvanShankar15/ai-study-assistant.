import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import prisma from '../config/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are an intelligent Academic Counselor AI. Your goal is to onboard a student to their personal AI study assistant platform.
You must ask questions conversationally, ONE AT A TIME, to gather the following information:
1. Name and Age
2. Education (University/School, Course, Semester)
3. Career Goals (e.g., Placements, GATE, Higher Studies)
4. Learning Style (e.g., Visual, Practical, Reading)
5. Weak and Strong Subjects
6. Average Daily Study Time

Currently gathered info: (you need to infer what you already know from the conversation history).

Your response must ALWAYS be a valid JSON object with the following structure:
{
  "completed": boolean, // Set to true ONLY if you have gathered at least Name, Education, Career Goals, Learning Style, and Study Time. Otherwise false.
  "message": "The next question you want to ask, or a concluding message if completed.",
  "profile": { // ONLY include this object if completed is true. It must contain the extracted data.
    "name": "string",
    "age": number,
    "university": "string",
    "course": "string",
    "careerGoals": ["string"],
    "learningStyle": ["string"],
    "studyHours": number
  }
}

DO NOT output any markdown blocks (like \`\`\`json). Output raw JSON only.
`;

export const onboardingChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;
    const userId = (req as any).userId;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const formattedHistory = messages.map(m => `${m.role === 'ai' ? 'AI' : 'Student'}: ${m.text}`).join('\n');
    
    const prompt = `${SYSTEM_PROMPT}\n\nConversation History:\n${formattedHistory}\n\nAI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error('Empty response from AI');
    }

    let result;
    try {
      result = JSON.parse(aiText);
    } catch (e) {
      console.error('Failed to parse AI JSON', aiText);
      res.status(500).json({ error: 'Failed to process AI response' });
      return;
    }

    // Save to database using Prisma
    if (result.completed && result.profile) {
      await prisma.profile.upsert({
        where: { userId },
        update: { ...result.profile },
        create: {
          userId,
          ...result.profile
        }
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Onboarding Error:', error);
    res.status(500).json({ error: 'Server error during onboarding' });
  }
};

export const parseTimetable = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const file = req.file;
    const { college, department, semester } = req.body;

    if (!file) {
      res.status(400).json({ error: 'No timetable file provided' });
      return;
    }

    const mimeType = file.mimetype;
    const base64Data = file.buffer.toString('base64');
    
    // We can't save to Firebase Storage since it's removed. 
    // In a production app, we would upload to a cloud provider here.

    const contextStr = (college && department && semester)
      ? `The student is currently in Semester ${semester}, studying in the ${department} department at ${college}.`
      : 'Analyze this student timetable document.';

    const prompt = `
    ${contextStr}
    Extract the list of subjects/classes from this timetable.
    For each subject, try to identify:
    - Subject Name (CRITICAL: Extract only the academic course name/code like 'Mathematics' or 'MAT2605'. Do NOT include classroom names, building numbers, or room codes like 'DFL04').
    - Type (Lecture, Lab, Tutorial)
    - Day of week
    - Start time and End time
    
    IMPORTANT: Ignore irrelevant details like classroom names, faculty names, or building codes. If a cell contains both a subject and a room code, extract ONLY the subject.

    Based on the schedule, also recommend a number of extra study blocks per week to optimize learning.

    Respond ONLY with a valid JSON object matching this structure, with no markdown formatting or extra text:
    {
      "subjects": [
        { "name": "string", "type": "string", "day": "string", "startTime": "string", "endTime": "string" }
      ],
      "studyBlocks": number
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType,
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const aiText = response.text;
    if (!aiText) throw new Error('Empty response from AI');

    const result = JSON.parse(aiText);

    // Save the extracted subjects and academic details to the user's profile
    await prisma.profile.upsert({
      where: { userId },
      update: { 
        subjects: result.subjects,
        university: college || undefined,
        course: department || undefined,
        semester: semester || undefined
      },
      create: { 
        userId, 
        subjects: result.subjects,
        university: college || undefined,
        course: department || undefined,
        semester: semester || undefined
      }
    });

    res.status(200).json({ timetable: result });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage.includes('503') || errMessage.includes('high demand') || errMessage.includes('UNAVAILABLE')) {
      res.status(503).json({ error: 'The AI model is currently experiencing high demand. Please wait a few seconds and try again.' });
    } else {
      res.status(500).json({ error: 'Failed to process timetable' });
    }
  }
};

export const chatEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, fileData, mimeType } = req.body;
    const userId = (req as any).userId;

    if (!message && !fileData) {
      res.status(400).json({ error: 'Message or file is required' });
      return;
    }

    const profileData = await prisma.profile.findUnique({
      where: { userId }
    });
    
    let context = 'You are a highly intelligent, personalized AI Study Assistant.\n';
    if (profileData) {
      context += `You are talking to a student named ${profileData.name || 'Student'}.
      They are studying ${profileData.course || 'a course'} at ${profileData.university || 'university'}.
      Their career goals are: ${(profileData.careerGoals as string[])?.join(', ') || 'Not specified'}.
      Their learning style is: ${(profileData.learningStyle as string[])?.join(', ') || 'Not specified'}.
      Use this information to personalize your advice, examples, and recommendations.`;
    }

    const formattedHistory = (history || [])
      .map((m: any) => `${m.role === 'ai' ? 'model' : 'user'}: ${m.text}`)
      .join('\n');

    const prompt = `${context}\n\nChat History:\n${formattedHistory}\n\nuser: ${message}\nmodel:`;

    const parts: any[] = [];
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          data: fileData,
          mimeType
        }
      });
    }
    parts.push({ text: prompt });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        temperature: 0.7,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error during chat' });
    } else {
      res.end();
    }
  }
};

export const generateResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const profileData = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profileData || !profileData.subjects || (profileData.subjects as any[]).length === 0) {
      res.status(400).json({ error: 'No subjects found in profile. Please upload your timetable first.' });
      return;
    }

    const subjects = profileData.subjects as any[];
    const subjectsList = subjects.map((sub: any) => `${sub.name} (${sub.type})`).join(', ');
    const prompt = `
    The student is studying the following subjects: ${subjectsList}.
    They are enrolled in the ${profileData.course || 'course'} program at ${profileData.university || 'university'}.
    They prefer ${profileData.learningStyle?.join(', ') || 'a mix of'} learning styles.
    
    CRITICAL INSTRUCTION: Use Google Search to find the actual academic syllabus, course structure, or library resources for these specific subjects at ${profileData.university || 'this university'}. 
    Do NOT guess or hallucinate generic portions. Your generated resources must align strictly with the verified syllabus.
    
    Generate a highly structured list of recommended study resources for these subjects based on the actual syllabus.
    For each subject, recommend:
    1. A Textbook or comprehensive reference (verified from the syllabus if possible)
    2. A suggested PPTX/presentation structure to build (based directly on the real syllabus units/modules)
    3. Key topics to study (based strictly on the real syllabus)
    
    Return EXACTLY a JSON array with this structure:
    [
      {
        "subjectName": "string",
        "textbook": "string",
        "pptxStructure": ["string"],
        "keyTopics": ["string"]
      }
    ]
    Output raw JSON only without markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }]
      }
    });

    const aiText = response.text;
    if (!aiText) throw new Error('Empty response from AI');

    const result = JSON.parse(aiText);
    
    // Save generated resources to profile
    await prisma.profile.update({
      where: { userId },
      data: { resources: result }
    });

    res.status(200).json({ resources: result });
  } catch (error) {
    console.error('Generate Resources Error:', error);
    res.status(500).json({ error: 'Failed to generate resources' });
  }
};

