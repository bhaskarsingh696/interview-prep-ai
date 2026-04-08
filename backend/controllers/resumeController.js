const Resume = require('../models/Resume');
const fs = require('fs');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Analyze resume with AI
const analyzeWithAI = async (text) => {
  const prompt = `You are an expert career counselor and technical recruiter. 
Analyze this resume text and return ONLY a JSON object (no extra text):

Resume Text:
${text.substring(0, 3000)}

Return this exact JSON structure:
{
  "skills": ["skill1", "skill2", "skill3"],
  "projects": ["project1 description", "project2 description"],
  "experience": ["experience1", "experience2"],
  "education": ["education1"],
  "jobRoles": ["Suitable Job Role 1", "Suitable Job Role 2", "Suitable Job Role 3"],
  "missingSkills": ["missing skill1", "missing skill2", "missing skill3"],
  "learningRoadmap": ["Step 1: Learn X", "Step 2: Build Y", "Step 3: Practice Z"],
  "overallFeedback": "Overall feedback about the resume in 2-3 sentences"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 2000
  });

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid AI response');
  return JSON.parse(jsonMatch[0]);
};

// Upload and analyze resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read file buffer
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text using pdf-parse
    let extractedText = '';
    try {
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } catch (pdfError) {
      console.error('PDF parse error:', pdfError.message);
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Could not read PDF file. Please try a different PDF.' });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'PDF appears to be empty or image-based. Please use a text-based PDF.' });
    }

    // Analyze with AI
    const analysis = await analyzeWithAI(extractedText);

    // Save to database
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      extractedText: extractedText.substring(0, 5000),
      ...analysis
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'Resume analyzed successfully!',
      resume
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    res.status(500).json({
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

// Get my resumes
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-extractedText');
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single resume
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadResume, getMyResumes, getResumeById };