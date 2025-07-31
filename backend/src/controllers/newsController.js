const axios = require('axios');
const Event = require('../models/Event');

/**
 * NewsController - Handles news fetching and integration
 * Fetches news from external APIs, maps to geographical coordinates,
 * and integrates with Event model for 3D globe visualization
 */
class NewsController {
  /**
   * Country to coordinates mapping for news article geolocation
   */
  static COUNTRY_COORDINATES = {
    'Afghanistan': { lat: 33.93911, lng: 67.709953, code: 'AF' },
    'Albania': { lat: 41.153332, lng: 20.168331, code: 'AL' },
    'Algeria': { lat: 28.033886, lng: 1.659626, code: 'DZ' },
    'Argentina': { lat: -38.416097, lng: -63.616672, code: 'AR' },
    'Australia': { lat: -25.274398, lng: 133.775136, code: 'AU' },
    'Austria': { lat: 47.516231, lng: 14.550072, code: 'AT' },
    'Bangladesh': { lat: 23.684994, lng: 90.356331, code: 'BD' },
    'Belgium': { lat: 50.503887, lng: 4.469936, code: 'BE' },
    'Brazil': { lat: -14.235004, lng: -51.92528, code: 'BR' },
    'Canada': { lat: 56.130366, lng: -106.346771, code: 'CA' },
    'China': { lat: 35.86166, lng: 104.195397, code: 'CN' },
    'Egypt': { lat: 26.820553, lng: 30.802498, code: 'EG' },
    'France': { lat: 46.227638, lng: 2.213749, code: 'FR' },
    'Germany': { lat: 51.165691, lng: 10.451526, code: 'DE' },
    'India': { lat: 20.593684, lng: 78.96288, code: 'IN' },
    'Indonesia': { lat: -0.789275, lng: 113.921327, code: 'ID' },
    'Iran': { lat: 32.427908, lng: 53.688046, code: 'IR' },
    'Iraq': { lat: 33.223191, lng: 43.679291, code: 'IQ' },
    'Israel': { lat: 31.046051, lng: 34.851612, code: 'IL' },
    'Italy': { lat: 41.87194, lng: 12.56738, code: 'IT' },
    'Japan': { lat: 36.204824, lng: 138.252924, code: 'JP' },
    'Mexico': { lat: 23.634501, lng: -102.552784, code: 'MX' },
    'Netherlands': { lat: 52.132633, lng: 5.291266, code: 'NL' },
    'Nigeria': { lat: 9.081999, lng: 8.675277, code: 'NG' },
    'Pakistan': { lat: 30.375321, lng: 69.345116, code: 'PK' },
    'Poland': { lat: 51.919438, lng: 19.145136, code: 'PL' },
    'Russia': { lat: 61.52401, lng: 105.318756, code: 'RU' },
    'Saudi Arabia': { lat: 23.885942, lng: 45.079162, code: 'SA' },
    'South Africa': { lat: -30.559482, lng: 22.937506, code: 'ZA' },
    'South Korea': { lat: 35.907757, lng: 127.766922, code: 'KR' },
    'Spain': { lat: 40.463667, lng: -3.74922, code: 'ES' },
    'Turkey': { lat: 38.963745, lng: 35.243322, code: 'TR' },
    'Ukraine': { lat: 48.379433, lng: 31.16558, code: 'UA' },
    'United Kingdom': { lat: 55.378051, lng: -3.435973, code: 'GB' },
    'United States': { lat: 37.09024, lng: -95.712891, code: 'US' },
    'Venezuela': { lat: 6.42375, lng: -66.58973, code: 'VE' }
  };

  /**
   * Fetch global news from multiple sources
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async fetchGlobalNews(req, res) {
    try {
      const { limit = 50, category = 'general' } = req.query;
      
      console.log('Fetching global news...');
      
      // Fetch from both news sources in parallel
      const [gNewsData, newsIData] = await Promise.allSettled([
        NewsController.fetchFromGNews({ limit: Math.ceil(limit / 2), category }),
        NewsController.fetchFromNewsI({ limit: Math.ceil(limit / 2), category })
      ]);

      const articles = [];
      
      // Process GNews results
      if (gNewsData.status === 'fulfilled' && gNewsData.value) {
        articles.push(...gNewsData.value);
      } else {
        console.warn('GNews fetch failed:', gNewsData.reason?.message);
      }
      
      // Process News.i results
      if (newsIData.status === 'fulfilled' && newsIData.value) {
        articles.push(...newsIData.value);
      } else {
        console.warn('News.i fetch failed:', newsIData.reason?.message);
      }

      if (articles.length === 0) {
        return res.status(503).json({
          success: false,
          message: 'Unable to fetch news from any source at this time'
        });
      }

      // Process and store articles
      const processedEvents = await NewsController.processNewsArticles(articles);
      
      res.json({
        success: true,
        data: {
          events: processedEvents,
          total: processedEvents.length,
          sources: {
            gnews: gNewsData.status === 'fulfilled',
            newsi: newsIData.status === 'fulfilled'
          }
        }
      });
      
    } catch (error) {
      console.error('Error fetching global news:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch global news',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Fetch news for a specific country
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async fetchCountryNews(req, res) {
    try {
      const { country } = req.params;
      const { limit = 30, category = 'general' } = req.query;

      if (!country) {
        return res.status(400).json({
          success: false,
          message: 'Country parameter is required'
        });
      }

      console.log(`Fetching news for country: ${country}`);

      // Get country code for API calls
      const countryData = NewsController.getCountryData(country);
      if (!countryData) {
        return res.status(400).json({
          success: false,
          message: 'Unsupported country'
        });
      }

      // Fetch from both news sources for the specific country
      const [gNewsData, newsIData] = await Promise.allSettled([
        NewsController.fetchFromGNews({ 
          limit: Math.ceil(limit / 2), 
          category, 
          country: countryData.code 
        }),
        NewsController.fetchFromNewsI({ 
          limit: Math.ceil(limit / 2), 
          category,
          country: countryData.code 
        })
      ]);

      const articles = [];
      
      if (gNewsData.status === 'fulfilled' && gNewsData.value) {
        articles.push(...gNewsData.value);
      }
      
      if (newsIData.status === 'fulfilled' && newsIData.value) {
        articles.push(...newsIData.value);
      }

      if (articles.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No news found for ${country}`
        });
      }

      // Process and store articles
      const processedEvents = await NewsController.processNewsArticles(articles, country);
      
      res.json({
        success: true,
        data: {
          country: country,
          events: processedEvents,
          total: processedEvents.length
        }
      });
      
    } catch (error) {
      console.error('Error fetching country news:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch country news',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get stored news events from database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStoredEvents(req, res) {
    try {
      const { 
        country, 
        limit = 50, 
        page = 1, 
        sortBy = 'published_at',
        order = 'desc' 
      } = req.query;

      const skip = (page - 1) * limit;
      const query = { eventType: 'news_event' };
      
      if (country) {
        query.country = new RegExp(country, 'i');
      }

      const sort = {};
      sort[sortBy] = order === 'desc' ? -1 : 1;

      const [events, total] = await Promise.all([
        Event.find(query)
          .sort(sort)
          .limit(parseInt(limit))
          .skip(skip)
          .select('-__v')
          .lean(),
        Event.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          events,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
      
    } catch (error) {
      console.error('Error fetching stored events:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stored events',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Fetch news from GNews API
   * @param {Object} options - Fetch options
   * @returns {Promise<Array>} Array of news articles
   */
  static async fetchFromGNews({ limit = 25, category = 'general', country = null }) {
    try {
      const apiKey = process.env.GNEWS_API_KEY;
      if (!apiKey) {
        throw new Error('GNews API key not configured');
      }

      let url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&max=${limit}`;
      
      if (category !== 'general') {
        url += `&category=${category}`;
      }
      
      if (country) {
        url += `&country=${country.toLowerCase()}`;
      }

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'iPray-Backend/1.0'
        }
      });

      if (!response.data || !response.data.articles) {
        console.warn('GNews API returned invalid response structure');
        return [];
      }

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source?.name || 'GNews',
          url: article.source?.url
        }
      }));
      
    } catch (error) {
      console.error('GNews fetch error:', error.message);
      throw error;
    }
  }

  /**
   * Fetch news from NewsData.io API  
   * @param {Object} options - Fetch options
   * @returns {Promise<Array>} Array of news articles
   */
  static async fetchFromNewsI({ limit = 25, category = 'general', country = null }) {
    try {
      const apiKey = process.env.NEWS_IO_API_KEY;
      if (!apiKey) {
        throw new Error('NewsData.io API key not configured');
      }

      // NewsData.io API URL
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&size=${limit}`;
      
      if (category !== 'general') {
        url += `&category=${category}`;
      }
      
      if (country) {
        url += `&country=${country}`;
      }

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'iPray-Backend/1.0'
        }
      });

      if (!response.data || !response.data.results) {
        console.warn('NewsData.io API returned invalid response structure');
        return [];
      }

      return response.data.results.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.link,
        image: article.image_url,
        publishedAt: article.pubDate,
        source: {
          name: article.source_id || 'NewsData.io',
          url: article.source_url
        }
      }));
      
    } catch (error) {
      console.error('NewsData.io fetch error:', error.message);
      throw error;
    }
  }

  /**
   * Process news articles and store as events in database
   * @param {Array} articles - Array of news articles
   * @param {String} targetCountry - Optional target country
   * @returns {Promise<Array>} Array of processed events
   */
  static async processNewsArticles(articles, targetCountry = null) {
    const processedEvents = [];
    
    for (const article of articles) {
      try {
        // Generate external ID for duplicate prevention
        const externalId = NewsController.generateExternalId(article);
        
        // Check if article already exists
        const existingEvent = await Event.findOne({ 
          external_id: externalId,
          eventType: 'news_event'
        });
        
        if (existingEvent) {
          console.log(`Skipping duplicate article: ${article.title}`);
          continue;
        }

        // Determine country and coordinates
        const countryInfo = NewsController.inferCountryFromArticle(article, targetCountry);
        const coordinates = countryInfo ? NewsController.COUNTRY_COORDINATES[countryInfo] : null;

        // Calculate priority based on article content
        const priority = NewsController.calculatePriority(article);

        // Create new event
        const eventData = {
          title: article.title?.substring(0, 200) || 'Untitled News',
          description: article.description?.substring(0, 2000) || article.content?.substring(0, 2000) || '',
          eventType: 'news_event',
          source: article.source?.name || 'Unknown Source',
          source_url: article.url,
          published_at: new Date(article.publishedAt || Date.now()),
          priority: priority,
          external_id: externalId,
          country: countryInfo,
          latitude: coordinates?.lat,
          longitude: coordinates?.lng
        };

        const newEvent = await Event.create(eventData);
        processedEvents.push(newEvent);
        
      } catch (error) {
        console.error('Error processing article:', article.title, error.message);
        continue;
      }
    }

    console.log(`Processed ${processedEvents.length} new articles out of ${articles.length} total`);
    return processedEvents;
  }

  /**
   * Generate external ID for duplicate prevention
   * @param {Object} article - News article object
   * @returns {String} External ID
   */
  static generateExternalId(article) {
    const crypto = require('crypto');
    const uniqueString = `${article.title}-${article.url}-${article.publishedAt}`;
    return crypto.createHash('md5').update(uniqueString).digest('hex');
  }

  /**
   * Infer country from article content
   * @param {Object} article - News article object
   * @param {String} targetCountry - Optional target country
   * @returns {String|null} Country name
   */
  static inferCountryFromArticle(article, targetCountry = null) {
    if (targetCountry) {
      return targetCountry;
    }

    const content = `${article.title} ${article.description} ${article.content || ''}`.toLowerCase();
    
    // Check for country mentions in content
    for (const [country] of Object.entries(NewsController.COUNTRY_COORDINATES)) {
      if (content.includes(country.toLowerCase())) {
        return country;
      }
    }

    // Check source URL for country indicators
    if (article.source?.url) {
      const url = article.source.url.toLowerCase();
      // Common country TLDs and indicators
      const countryIndicators = {
        '.uk': 'United Kingdom',
        '.ca': 'Canada',
        '.au': 'Australia',
        '.de': 'Germany',
        '.fr': 'France',
        '.in': 'India',
        '.jp': 'Japan',
        '.cn': 'China',
        '.br': 'Brazil',
        '.ru': 'Russia'
      };
      
      for (const [indicator, country] of Object.entries(countryIndicators)) {
        if (url.includes(indicator)) {
          return country;
        }
      }
    }

    return 'Global'; // Default for international news
  }

  /**
   * Calculate article priority based on content
   * @param {Object} article - News article object
   * @returns {Number} Priority score (1-10)
   */
  static calculatePriority(article) {
    let priority = 5; // Default priority
    
    const content = `${article.title} ${article.description || ''}`.toLowerCase();
    
    // High priority keywords
    const highPriorityKeywords = ['breaking', 'urgent', 'emergency', 'crisis', 'disaster', 'war', 'conflict', 'death', 'killed'];
    const mediumPriorityKeywords = ['government', 'politics', 'economy', 'health', 'covid', 'election'];
    
    // Check for priority keywords
    if (highPriorityKeywords.some(keyword => content.includes(keyword))) {
      priority = Math.min(priority + 3, 10);
    } else if (mediumPriorityKeywords.some(keyword => content.includes(keyword))) {
      priority = Math.min(priority + 1, 8);
    }
    
    // Adjust based on recency
    const publishedAt = new Date(article.publishedAt || Date.now());
    const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
    
    if (hoursOld < 2) {
      priority = Math.min(priority + 1, 10);
    } else if (hoursOld > 24) {
      priority = Math.max(priority - 1, 1);
    }
    
    return Math.round(priority);
  }

  /**
   * Get country data by name
   * @param {String} countryName - Country name
   * @returns {Object|null} Country data object
   */
  static getCountryData(countryName) {
    // Case-insensitive search
    for (const [name, data] of Object.entries(NewsController.COUNTRY_COORDINATES)) {
      if (name.toLowerCase() === countryName.toLowerCase()) {
        return { ...data, name };
      }
    }
    return null;
  }

  /**
   * Get list of supported countries
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSupportedCountries(req, res) {
    try {
      const countries = Object.keys(NewsController.COUNTRY_COORDINATES).sort();
      
      res.json({
        success: true,
        data: {
          countries: countries,
          total: countries.length
        }
      });
    } catch (error) {
      console.error('Error fetching supported countries:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch supported countries'
      });
    }
  }

  /**
   * Get events with coordinates for Globe visualization
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getEventsForGlobe(req, res) {
    try {
      const { 
        limit = 100, 
        minPriority = 1,
        hours = 24 
      } = req.query;

      // Calculate time threshold
      const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);

      const query = { 
        eventType: 'news_event',
        latitude: { $exists: true, $ne: null },
        longitude: { $exists: true, $ne: null },
        priority: { $gte: parseInt(minPriority) },
        published_at: { $gte: timeThreshold }
      };

      const events = await Event.find(query)
        .sort({ priority: -1, published_at: -1 })
        .limit(parseInt(limit))
        .select({
          _id: 1,
          title: 1,
          description: 1,
          latitude: 1,
          longitude: 1,
          priority: 1,
          country: 1,
          source: 1,
          source_url: 1,
          published_at: 1,
          external_id: 1
        })
        .lean();

      // Transform events for Globe visualization
      const globeEvents = events.map(event => ({
        id: event._id,
        lat: event.latitude,
        lng: event.longitude,
        title: event.title,
        description: event.description?.substring(0, 150) + '...',
        priority: event.priority,
        country: event.country,
        source: event.source,
        url: event.source_url,
        publishedAt: event.published_at,
        externalId: event.external_id,
        // Calculate marker intensity based on priority
        intensity: Math.min(event.priority / 10, 1),
        // Calculate marker size based on priority
        size: Math.max(2 + (event.priority * 0.5), 2)
      }));

      res.json({
        success: true,
        data: {
          events: globeEvents,
          total: globeEvents.length,
          timeRange: `${hours} hours`,
          minPriority: parseInt(minPriority)
        }
      });
      
    } catch (error) {
      console.error('Error fetching events for globe:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events for globe visualization',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = NewsController;
