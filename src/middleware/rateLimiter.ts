import rateLimit from 'express-rate-limit';

export const postRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// You can define more rate limiters for different routes as needed
