// Initialize API tokens
const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_KEY;
const GOOGLE_CLOUD_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;

// Configuration
const MAX_POLLING_ATTEMPTS = 30; // 30 seconds
const POLLING_INTERVAL = 1000; // 1 second
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

interface ProgressCallback {
  (progress: number, status: string): void;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await delay(delayMs);
      return retryOperation(operation, retries - 1, delayMs);
    }
    throw error;
  }
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export async function generateImage(
  prompt: string,
  onProgress?: ProgressCallback
): Promise<string[]> {
  try {
    // Create prediction with retry
    onProgress?.(0, "Starting generation...");
    const prediction = await retryOperation(async () => {
      const response = await fetch("/api/replicate/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${REPLICATE_API_TOKEN}`
        },
        body: JSON.stringify({
          version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
          input: {
            prompt,
            negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
            scheduler: "K_EULER",
            num_inference_steps: 50,
            guidance_scale: 7.5,
            width: 768,
            height: 768,
            num_outputs: 2  // Generate 2 variations
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your API key.');
        }
        throw new Error(
          errorData.detail || 
          `Failed to start image generation (HTTP ${response.status}). ` +
          'Please check your connection and try again.'
        );
      }

      return response.json();
    });

    // Poll for the result
    let attempts = 0;
    let result = null;

    while (!result && attempts < MAX_POLLING_ATTEMPTS) {
      try {
        const pollResponse = await fetch(
          `/api/replicate/predictions/${prediction.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${REPLICATE_API_TOKEN}`
            },
          }
        );

        if (!pollResponse.ok) {
          if (pollResponse.status === 401) {
            throw new Error('Authentication failed. Please check your API key.');
          }
          throw new Error('Failed to check generation status. Will retry automatically.');
        }

        const pollResult = await pollResponse.json();
        const progress = (attempts / MAX_POLLING_ATTEMPTS) * 100;
        
        switch (pollResult.status) {
          case "starting":
            onProgress?.(progress, "Initializing...");
            break;
          case "processing":
            onProgress?.(progress, "Generating variations...");
            break;
          case "succeeded":
            onProgress?.(100, "Complete!");
            result = pollResult.output;
            break;
          case "failed":
            throw new Error(
              pollResult.error || 
              'Image generation failed. Please try again with a different prompt.'
            );
          case "canceled":
            throw new Error('Image generation was canceled.');
          default:
            onProgress?.(progress, "Processing...");
        }

        if (!result) {
          await delay(POLLING_INTERVAL);
          attempts++;
        }
      } catch (error) {
        if (attempts < MAX_POLLING_ATTEMPTS - 1) {
          console.warn('Polling error, retrying:', error);
          await delay(POLLING_INTERVAL);
          attempts++;
          continue;
        }
        throw error;
      }
    }

    if (!result || result.length < 2) {
      throw new Error(
        'Image generation timed out or failed. Please try again. ' +
        'If this persists, try a simpler prompt.'
      );
    }

    return result;
  } catch (error) {
    console.error('Error generating images:', error);
    if (error instanceof Error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during image generation.');
  }
}

// Local storage key for image history
const IMAGE_HISTORY_KEY = 'generated_images_history';

// Function to save image to history
export function saveToImageHistory(urls: string[], prompt: string) {
  try {
    const existingHistory = getImageHistory();
    const newImages = urls.map(url => ({
      url,
      prompt,
      timestamp: Date.now()
    }));
    
    const updatedHistory = [...newImages, ...existingHistory].slice(0, 50); // Keep last 50 images
    localStorage.setItem(IMAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error saving to history:', error);
    return [];
  }
}

// Function to get image history
export function getImageHistory(): GeneratedImage[] {
  try {
    const history = localStorage.getItem(IMAGE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

// Function to clear image history
export function clearImageHistory() {
  localStorage.removeItem(IMAGE_HISTORY_KEY);
}

// Function to download image
export async function downloadImage(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
}

export async function analyzeImage(imageFile: File): Promise<string> {
  try {
    // Convert image to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Remove data URL prefix
    const base64Content = base64Image.split(',')[1];

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Content
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              },
              {
                type: 'LABEL_DETECTION',
                maxResults: 5
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 5
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Process and format the results
    let analysis = [];
    
    // Text detection
    if (result.responses[0].fullTextAnnotation) {
      analysis.push('📝 Text found in image:\n' + result.responses[0].fullTextAnnotation.text);
    }
    
    // Labels
    if (result.responses[0].labelAnnotations) {
      const labels = result.responses[0].labelAnnotations
        .map((label: any) => `${label.description} (${Math.round(label.score * 100)}%)`)
        .join(', ');
      analysis.push('\n🏷️ Image contains: ' + labels);
    }
    
    // Objects
    if (result.responses[0].localizedObjectAnnotations) {
      const objects = result.responses[0].localizedObjectAnnotations
        .map((obj: any) => `${obj.name} (${Math.round(obj.score * 100)}%)`)
        .join(', ');
      analysis.push('\n🎯 Objects detected: ' + objects);
    }

    return analysis.join('\n\n');
  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error('Failed to analyze image: Unknown error');
  }
} 