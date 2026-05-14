import "server-only";

import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_REPLY_LENGTH = 2000;
const MAX_INPUT_LENGTH = 2000; // Limit input to prevent oversized requests
const RETRY_DELAY_MS = 20000; // 20 seconds
const MAX_RETRIES = 1; // Only retry once

const SYSTEM_PROMPT = `Kamu adalah AI Pilah, asisten edukasi sampah dan daur ulang untuk Pilah Yuk!!.

INSTRUKSI PENTING:
- Jawab SELALU dalam Bahasa Indonesia yang ramah, jelas, dan cukup lengkap.
- Jangan menjawab terlalu pendek atau singkat-singkat.
- Untuk SETIAP jawaban, berikan struktur berikut:
  1. Jawaban Utama - Langsung jawab pertanyaan dengan jelas
  2. Penjelasan Singkat - Jelaskan mengapa/bagaimana dengan singkat
  3. Contoh Praktis - Berikan contoh nyata yang mudah dipahami
  4. Tips Tambahan - Sertakan tips praktis jika relevan dengan topik

PANJANG JAWABAN:
- Ideal: 3-6 kalimat penuh (tidak termasuk pembilangan)
- Jangan terlalu ringkas, tetapi juga jangan terlalu panjang
- Pastikan setiap kalimat menambah nilai edukatif

HANDLING PERTANYAAN:
- Jika pertanyaan singkat atau ambigu, tetap beri jawaban edukatif yang membantu
- Jangan hanya membalas sapaan, selalu sertakan informasi bermanfaat
- Arahkan diskusi ke topik sampah dan daur ulang

FOKUS TOPIK:
- Sampah, daur ulang, kategori sampah, edukasi lingkungan
- Tips memilah sampah yang efektif
- Cara menangani berbagai jenis sampah (organik, anorganik, residu, B3)
- Dampak lingkungan dan manfaat daur ulang

TONE & GAYA:
- Ramah dan santai (bukan formal rigid)
- Modern dan relatable untuk segala usia
- Edukatif namun mudah dipahami
- Gunakan bahasa yang konkret dan praktis

CONTOH JAWABAN YANG BAIK:
"Kertas yang kotor biasanya tidak disarankan untuk didaur ulang, terutama kalau terkena minyak, makanan, atau cairan. Kotoran itu bisa mengganggu proses daur ulang dan menurunkan kualitas kertas hasil olahan. Kalau hanya sedikit debu atau coretan pensil, biasanya masih aman. Tipsnya, pisahkan kertas bersih untuk daur ulang, sedangkan kertas berminyak seperti bungkus gorengan sebaiknya masuk sampah residu atau kompos jika bahannya aman terurai."

Jika pengguna keluar topik, arahkan kembali ke topik lingkungan dan sampah secara sopan tanpa menggurui.`;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  return new GoogleGenAI({ apiKey });
}

// Error type detectors
function isQuotaError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("429") ||
      errorMessage.includes("resource_exhausted") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("rate_limit") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("too many requests")
    );
  }
  return false;
}

function isModelNotFoundError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("404") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("model not found") ||
      errorMessage.includes("invalid model")
    );
  }
  return false;
}

function isApiKeyError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("api_key") ||
      errorMessage.includes("api key") ||
      errorMessage.includes("unauthenticated") ||
      errorMessage.includes("permission denied") ||
      errorMessage.includes("invalid api key") ||
      errorMessage.includes("403") ||
      errorMessage.includes("401")
    );
  }
  return false;
}

// Sleep utility for retry delay
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAiPilahReply(message: string): Promise<string> {
  // Validate and truncate input if necessary
  if (!message || message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  const limitedMessage = message.length > MAX_INPUT_LENGTH 
    ? message.substring(0, MAX_INPUT_LENGTH) 
    : message;

  let lastError: Error | null = null;
  let retryCount = 0;

  // Retry logic: attempt initial call + 1 retry (only for quota errors)
  while (retryCount <= MAX_RETRIES) {
    try {
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: limitedMessage,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      if (text.length > MAX_REPLY_LENGTH) {
        return `${text.slice(0, MAX_REPLY_LENGTH).trimEnd()}...`;
      }

      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check error types and handle accordingly
      if (isQuotaError(error)) {
        if (retryCount < MAX_RETRIES) {
          console.warn(
            `[GEMINI_QUOTA_ERROR] Quota/Rate limit exceeded. Retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`,
            lastError.message
          );
          await sleep(RETRY_DELAY_MS);
          retryCount++;
        } else {
          // Mark this as a quota error for route handler
          const quotaError = new Error("QUOTA_EXCEEDED_FINAL");
          Object.assign(quotaError, { originalError: lastError });
          throw quotaError;
        }
      } else if (isModelNotFoundError(error)) {
        // Model not found - don't retry, throw immediately
        const modelError = new Error("MODEL_NOT_FOUND");
        Object.assign(modelError, { originalError: lastError });
        throw modelError;
      } else if (isApiKeyError(error)) {
        // API key error - don't retry, throw immediately
        const keyError = new Error("INVALID_API_KEY");
        Object.assign(keyError, { originalError: lastError });
        throw keyError;
      } else {
        // Other errors - throw immediately without retry
        throw lastError;
      }
    }
  }

  // Should not reach here, but if it does, throw the last error
  if (lastError) {
    throw lastError;
  }

  throw new Error("Failed to generate AI response");
}

export { SYSTEM_PROMPT as aiPilahSystemPrompt };