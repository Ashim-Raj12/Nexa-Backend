import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching user ${error}` });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Update assistant error ${error}` });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry , I can't understant" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);

    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("hh:mm:ss A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
        return res.json({
          type,
          userInput: gemResult.userInput,
          // Let Gemini give a longer answer here
          response: gemResult.response || "Here’s what I found.",
        });
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "whatsapp_open":
      case "telegram_open":
      case "twitter_open":
      case "gmail_open":
      case "maps_open":
      case "notes_open":
      case "reminder_set":
      case "alarm_set":
      case "timer_set":
      case "news_show":
      case "sports_score":
      case "joke_tell":
      case "quote_tell":
      case "music_play":
      case "call_contact":
      case "message_send":
      case "wifi_toggle":
      case "bluetooth_toggle":
      case "flashlight_toggle":
      case "volume_change":
      case "settings_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res
          .status(400)
          .json({ response: "I did not understand that command" });
    }
  } catch (error) {
    return res.status(500).json({ response: "Ask assistant error " });
  }
};
