const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const GeneratedPrayer = require('../models/GeneratedPrayer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Initialize AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate prayer text using OpenAI GPT-4
 * @param {Object} params - Parameters for prayer generation
 * @returns {Promise<string>} Generated prayer text
 */
const generatePrayerText = async ({ userIntent, keywords = [], theme = '', length = 'medium', language = 'English' }) => {
  try {
    // Construct the user message dynamically
    let userMessage = `Please generate a ${length} prayer in ${language}`;
    
    if (userIntent) {
      userMessage += ` for someone who is ${userIntent}`;
    }
    
    if (theme) {
      userMessage += `. The theme should focus on ${theme}`;
    }
    
    if (keywords.length > 0) {
      userMessage += `. Please incorporate these keywords if appropriate: ${keywords.join(', ')}`;
    }
    
    userMessage += '. The prayer should be comforting, uplifting, and spiritually meaningful.';

    // Call OpenAI Chat Completions API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo as it's more widely available
        messages: [
          {
            role: 'system',
            content: `You are a compassionate, empathetic, and spiritual AI assistant specializing in creating personalized prayers for people in various life situations. Your prayers should be:

1. Inclusive and respectful of different faith traditions
2. Comforting and uplifting in tone
3. Personally relevant to the user's situation
4. Appropriately length-adjusted (short: 2-3 sentences, medium: 4-6 sentences, long: 7-10 sentences)
5. Free from specific denominational references unless specifically requested
6. Focused on hope, healing, strength, gratitude, or guidance as appropriate

Always respond with just the prayer text, without any additional commentary or formatting.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new AppError('Failed to generate prayer text. Please try again.', 500);
  }
};

/**
 * Generate speech audio using Eleven Labs
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Voice ID for Eleven Labs
 * @returns {Promise<Buffer>} Audio buffer
 */
const generateSpeechAudio = async (text, voiceId) => {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Eleven Labs API Error:', error.response?.data || error.message);
    throw new AppError('Failed to generate prayer audio. Please try again.', 500);
  }
};

/**
 * Upload audio file to AWS S3
 * @param {Buffer} audioBuffer - Audio data buffer
 * @param {string} fileName - Name for the file
 * @returns {Promise<Object>} S3 upload result with URL and key
 */
const uploadAudioToS3 = async (audioBuffer, fileName) => {
  try {
    const s3Key = `audio/${fileName}`;
    
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct public URL
    const s3FileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return {
      s3FileUrl,
      s3Key,
    };
  } catch (error) {
    console.error('AWS S3 Upload Error:', error);
    throw new AppError('Failed to upload audio file. Please try again.', 500);
  }
};

/**
 * Main function to generate prayer with optional audio
 */
const generatePrayer = catchAsync(async (req, res, next) => {
  const {
    userIntent,
    keywords = [],
    theme = '',
    length = 'medium',
    language = 'English',
    generateAudio = false,
    voiceId
  } = req.body;

  // Validate required fields
  if (!userIntent || userIntent.trim().length === 0) {
    return next(new AppError('User intent is required for prayer generation', 400));
  }

  if (generateAudio && !voiceId) {
    return next(new AppError('Voice ID is required when audio generation is requested', 400));
  }

  // Validate length parameter
  if (!['short', 'medium', 'long'].includes(length)) {
    return next(new AppError('Length must be one of: short, medium, long', 400));
  }

  try {
    // Step 1: Generate prayer text using OpenAI
    console.log('Generating prayer text...');
    const generatedPrayerText = await generatePrayerText({
      userIntent,
      keywords,
      theme,
      length,
      language
    });

    let s3FileUrl = null;
    let s3Key = null;

    // Step 2: Generate audio if requested
    if (generateAudio) {
      console.log('Generating prayer audio...');
      
      // Generate audio using Eleven Labs
      const audioBuffer = await generateSpeechAudio(generatedPrayerText, voiceId);
      
      // Upload to S3
      const timestamp = Date.now();
      const fileName = `prayer_${req.user.id}_${timestamp}.mp3`;
      
      const uploadResult = await uploadAudioToS3(audioBuffer, fileName);
      s3FileUrl = uploadResult.s3FileUrl;
      s3Key = uploadResult.s3Key;
      
      console.log('Audio uploaded to S3:', s3FileUrl);
    }

    // Step 3: Save to database
    const generatedPrayer = await GeneratedPrayer.create({
      userId: req.user.id,
      userIntent,
      theme,
      keywords,
      language,
      length,
      generatedText: generatedPrayerText,
      audioGenerated: generateAudio,
      voiceId: generateAudio ? voiceId : undefined,
      s3FileUrl,
      s3Key,
    });

    // Step 4: Return response
    res.status(200).json({
      status: 'success',
      data: {
        id: generatedPrayer._id,
        generatedPrayerText,
        s3FileUrl,
        audioGenerated: generateAudio,
        theme,
        language,
        length,
        createdAt: generatedPrayer.createdAt
      }
    });

  } catch (error) {
    console.error('Prayer generation error:', error);
    return next(error);
  }
});

/**
 * Get user's prayer history
 */
const getPrayerHistory = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, theme } = req.query;

  // Build query
  const query = { userId: req.user.id };
  if (theme) {
    query.theme = { $regex: theme, $options: 'i' };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch prayers
  const prayers = await GeneratedPrayer.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  // Get total count
  const total = await GeneratedPrayer.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: prayers.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      prayers,
    },
  });
});

/**
 * Get a specific prayer by ID
 */
const getPrayerById = catchAsync(async (req, res, next) => {
  const { prayerId } = req.params;

  const prayer = await GeneratedPrayer.findOne({
    _id: prayerId,
    userId: req.user.id
  }).select('-__v');

  if (!prayer) {
    return next(new AppError('Prayer not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      prayer,
    },
  });
});

/**
 * Delete a prayer
 */
const deletePrayer = catchAsync(async (req, res, next) => {
  const { prayerId } = req.params;

  const prayer = await GeneratedPrayer.findOne({
    _id: prayerId,
    userId: req.user.id
  });

  if (!prayer) {
    return next(new AppError('Prayer not found', 404));
  }

  // TODO: Optionally delete S3 file if exists
  // if (prayer.s3Key) {
  //   await deleteFromS3(prayer.s3Key);
  // }

  await GeneratedPrayer.findByIdAndDelete(prayerId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  generatePrayer,
  getPrayerHistory,
  getPrayerById,
  deletePrayer,
};
