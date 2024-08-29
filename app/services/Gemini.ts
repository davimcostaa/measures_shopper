import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";

export default class GeminiService {

  public async getGeminiValue(image: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });


    const buffer = Buffer.from(image, "base64");

    fs.writeFileSync("measurer.jpeg", buffer);

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    const uploadResponse = await fileManager.uploadFile("measurer.jpeg", {
      mimeType: "image/jpeg",
      displayName: "measurer",
    });

    const imgUri = uploadResponse.file.uri;
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: imgUri
        }
      },
      { text: "This photo it's a measurer. I would like the numbers inside the circle, in the little squares. Return just the numbers, no text" },
    ]);


    fs.unlinkSync("measurer.jpeg");


  return {result: result.response.text(), imgUri}
  }

}
