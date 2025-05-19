import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  VolumeIcon,
  Copy,
  Languages,
  MessageCircle,
  ArrowRight,
  ListPlus,
  Check,
  History,
  Trash2,
  GlobeIcon,
  Camera,
  Image,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Send,
  Loader2,
  FileImage
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GoogleTranslate = () => {
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("th");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    original: string;
    translated: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: Date;
  }>>([]);
  const [savedPhrases, setSavedPhrases] = useState<Array<{
    original: string;
    translated: string;
    sourceLanguage: string;
    targetLanguage: string;
    category: string;
  }>>([]);
  const [newPhraseCategory, setNewPhraseCategory] = useState<string>("general");
  const [activeTab, setActiveTab] = useState<string>("translate");
  
  // Voice translation states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceDetected, setVoiceDetected] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>("");
  const [conversationMode, setConversationMode] = useState<boolean>(false);
  
  // Camera translation states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageText, setImageText] = useState<string>("");
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Language options focused on Southeast Asian countries
  const languages = [
    { code: "en", name: "English" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
    { code: "km", name: "Khmer (Cambodian)" },
    { code: "ms", name: "Malay" },
    { code: "id", name: "Indonesian" },
    { code: "fil", name: "Filipino" },
    { code: "my", name: "Burmese" },
    { code: "lo", name: "Lao" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" }
  ];

  // Phrase categories
  const phraseCategories = [
    { value: "general", label: "General" },
    { value: "greetings", label: "Greetings" },
    { value: "directions", label: "Directions" },
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "accommodation", label: "Accommodation" },
    { value: "shopping", label: "Shopping" },
    { value: "emergency", label: "Emergency" },
    { value: "medical", label: "Medical" }
  ];

  // Common phrases by category
  const commonPhrases = {
    greetings: [
      { phrase: "Hello", context: "Basic greeting" },
      { phrase: "Thank you", context: "Expressing gratitude" },
      { phrase: "Yes", context: "Affirmative response" },
      { phrase: "No", context: "Negative response" },
      { phrase: "Excuse me", context: "Getting attention politely" },
      { phrase: "Sorry", context: "Apologizing" },
      { phrase: "Goodbye", context: "Leaving" }
    ],
    directions: [
      { phrase: "Where is the bathroom?", context: "Finding facilities" },
      { phrase: "How do I get to the train station?", context: "Transportation" },
      { phrase: "Is it far from here?", context: "Distance question" },
      { phrase: "Can you show me on the map?", context: "Requesting visual guidance" },
      { phrase: "Turn left/right", context: "Direction instruction" }
    ],
    food: [
      { phrase: "I would like to order this", context: "At a restaurant" },
      { phrase: "The bill, please", context: "Requesting check" },
      { phrase: "Is this spicy?", context: "Meal inquiry" },
      { phrase: "I'm vegetarian", context: "Dietary restriction" },
      { phrase: "Water, please", context: "Requesting beverage" }
    ],
    transportation: [
      { phrase: "How much is the fare?", context: "Cost inquiry" },
      { phrase: "Does this bus go to...?", context: "Route confirmation" },
      { phrase: "I need a taxi", context: "Requesting service" },
      { phrase: "Please take me to this address", context: "Giving destination" },
      { phrase: "When is the next train?", context: "Schedule inquiry" }
    ],
    emergency: [
      { phrase: "Help!", context: "Urgent assistance" },
      { phrase: "Call the police", context: "Security emergency" },
      { phrase: "I need a doctor", context: "Medical emergency" },
      { phrase: "There's been an accident", context: "Reporting incident" }
    ]
  };

  // Common responses in Southeast Asian languages - expanded dictionary
  const commonResponses: Record<string, Record<string, string>> = {
    th: {
      "Hello": "สวัสดี (Sawasdee)",
      "Thank you": "ขอบคุณ (Khob khun)",
      "Yes": "ใช่ (Chai)",
      "No": "ไม่ (Mai)",
      "Excuse me": "ขอโทษ (Kor thot)",
      "Where is the bathroom?": "ห้องน้ำอยู่ที่ไหน (Hong nam yu tee nai)",
      "How much does this cost?": "นี่ราคาเท่าไร (Nee raka tao rai)",
      "I need a taxi": "ฉันต้องการแท็กซี่ (Chan tong gaan taxi)",
      "The bill, please": "เช็คบิลครับ/คะ (Check bin krub/ka)",
      "I'm vegetarian": "ฉันทานเจ (Chan tan jay)",
      "Water, please": "ขอน้ำหน่อย (Kor nam noi)"
    },
    vi: {
      "Hello": "Xin chào",
      "Thank you": "Cảm ơn",
      "Yes": "Vâng/Có",
      "No": "Không",
      "Excuse me": "Xin lỗi",
      "Where is the bathroom?": "Nhà vệ sinh ở đâu?",
      "How much does this cost?": "Cái này giá bao nhiêu?",
      "I need a taxi": "Tôi cần một taxi",
      "The bill, please": "Hóa đơn, làm ơn",
      "I'm vegetarian": "Tôi ăn chay",
      "Water, please": "Cho tôi xin nước"
    },
    km: {
      "Hello": "ជំរាបសួរ (Chom reap sour)",
      "Thank you": "អរគុណ (Arkoun)",
      "Yes": "បាទ/ចាស (Baat/chaa)",
      "No": "ទេ (Te)",
      "Excuse me": "សូមទោស (Som toh)",
      "Where is the bathroom?": "តើបន្ទប់ទឹកនៅឯណា? (Tae bantup teuk nov ae na?)",
      "How much does this cost?": "តើវាថ្លៃប៉ុន្មាន? (Tae via tlai ponman?)",
      "I need a taxi": "ខ្ញុំត្រូវការតាក់ស៊ី (Knom trovkar taxi)",
      "The bill, please": "សូមគិតលុយ (Som kit luy)",
      "I'm vegetarian": "ខ្ញុំញ៉ាំតែបន្លែ (Knom nyam tae bonle)",
      "Water, please": "សូមទឹកមួយ (Som teuk muoy)"
    },
    ms: {
      "Hello": "Selamat sejahtera",
      "Thank you": "Terima kasih",
      "Yes": "Ya",
      "No": "Tidak",
      "Excuse me": "Maafkan saya",
      "Where is the bathroom?": "Di mana tandas?",
      "How much does this cost?": "Berapa harganya?",
      "I need a taxi": "Saya perlukan teksi",
      "The bill, please": "Bil, sila",
      "I'm vegetarian": "Saya vegetarian",
      "Water, please": "Air, sila"
    },
    fil: {
      "Hello": "Kamusta",
      "Thank you": "Salamat",
      "Yes": "Oo",
      "No": "Hindi",
      "Excuse me": "Patawad po",
      "Where is the bathroom?": "Nasaan ang banyo?",
      "How much does this cost?": "Magkano ito?",
      "I need a taxi": "Kailangan ko ng taxi",
      "The bill, please": "Ang bill, pakisuyo",
      "I'm vegetarian": "Vegetarian ako",
      "Water, please": "Tubig, pakisuyo"
    },
    lo: {
      "Hello": "ສະບາຍດີ (Sabaidee)",
      "Thank you": "ຂອບໃຈ (Khop chai)",
      "Yes": "ແມ່ນແລ້ວ (Maen laew)",
      "No": "ບໍ່ (Bo)",
      "Excuse me": "ຂໍໂທດ (Kho thot)",
      "Where is the bathroom?": "ຫ້ອງນ້ຳຢູ່ໃສ (Hong nam yu sai)",
      "How much does this cost?": "ລາຄາເທົ່າໃດ (Laka thao dai)",
      "I need a taxi": "ຂ້ອຍຕ້ອງການລົດແທັກຊີ (Khoy tongkan lot taxi)",
      "The bill, please": "ເອົາບິນແດ່ (Ao bin dae)",
      "I'm vegetarian": "ຂ້ອຍກິນຜັກ (Khoy kin phak)",
      "Water, please": "ຂໍນ້ຳແດ່ (Kho nam dae)"
    },
    my: {
      "Hello": "မင်္ဂလာပါ (Mingalar ba)",
      "Thank you": "ကျေးဇူးတင်ပါတယ် (Kyeizu tin ba de)",
      "Yes": "ဟုတ်ကဲ့ (Hote kae)",
      "No": "မဟုတ်ဘူး (Ma hote bu)",
      "Excuse me": "ခွင့်လွှတ်ပါ (Khwin lwut ba)",
      "Where is the bathroom?": "အိမ်သာဘယ်မှာလဲ (Ein tha beh hma le)",
      "How much does this cost?": "ဒါဘယ်လောက်ကျလဲ (Da beh lout kya le)",
      "I need a taxi": "ကျွန်တော်/ကျွန်မ တက္ကစီလိုချင်တယ် (Kyaw doh/kyaw ma taxi lo chin de)",
      "The bill, please": "ငွေရှင်းမလို့ပါ (Ngwe shin ma lo ba)",
      "I'm vegetarian": "ကျွန်တော်/ကျွန်မ သစ်သီးဟင်းရွက်စားသူပါ (Kyaw doh/kyaw ma thit thi hin ywet za thu ba)",
      "Water, please": "ရေပေးပါ (Ye pay ba)"
    },
    id: {
      "Hello": "Halo",
      "Thank you": "Terima kasih",
      "Yes": "Ya",
      "No": "Tidak",
      "Excuse me": "Permisi",
      "Where is the bathroom?": "Di mana kamar kecil?",
      "How much does this cost?": "Berapa harganya?",
      "I need a taxi": "Saya perlu taksi",
      "The bill, please": "Minta tagihan",
      "I'm vegetarian": "Saya vegetarian",
      "Water, please": "Air, tolong"
    }
  };

  // Comprehensive translation function with built-in phrase dictionary
  const simulateTranslation = (text: string, source: string, target: string) => {
    setIsTranslating(true);
    
    // Helper function to translate simple text to Thai
    const translateToThai = (txt: string): string => {
      const thaiDict: Record<string, string> = {
        "hello": "สวัสดี (Sawasdee)",
        "thank you": "ขอบคุณ (Khob khun)",
        "yes": "ใช่ (Chai)",
        "no": "ไม่ (Mai)",
        "excuse me": "ขอโทษ (Kor thot)",
        "sorry": "ขอโทษ (Kor thot)",
        "good morning": "สวัสดีตอนเช้า (Sawasdee ton chao)",
        "good evening": "สวัสดีตอนเย็น (Sawasdee ton yen)",
        "good night": "ราตรีสวัสดิ์ (Ratri sawat)",
        "goodbye": "ลาก่อน (La kon)",
        "how are you": "คุณสบายดีไหม (Khun sabai dee mai)",
        "i am fine": "ฉันสบายดี (Chan sabai dee)",
        "what is your name": "คุณชื่ออะไร (Khun cheu arai)",
        "my name is": "ฉันชื่อ (Chan cheu)",
        "nice to meet you": "ยินดีที่ได้พบคุณ (Yindi thi dai pob khun)",
        "where is": "อยู่ที่ไหน (Yu thi nai)",
        "how much": "ราคาเท่าไร (Raka tao rai)",
        "too expensive": "แพงเกินไป (Paeng gern pai)",
        "cheaper please": "ขอราคาถูกลงหน่อย (Kor raka thook long noi)",
        "delicious": "อร่อย (Aroi)",
        "water": "น้ำ (Nam)",
        "food": "อาหาร (Ahan)",
        "restaurant": "ร้านอาหาร (Ran ahan)",
        "hotel": "โรงแรม (Rong ram)",
        "airport": "สนามบิน (Sanam bin)",
        "train station": "สถานีรถไฟ (Sathanee rot fai)",
        "bus station": "สถานีรถบัส (Sathanee rot bus)",
        "taxi": "แท็กซี่ (Taxi)",
        "beach": "ชายหาด (Chai had)",
        "market": "ตลาด (Talad)",
        "shopping mall": "ห้างสรรพสินค้า (Hang sappasinkha)",
        "hospital": "โรงพยาบาล (Rong payaban)",
        "police station": "สถานีตำรวจ (Sathanee tamruat)",
        "toilet": "ห้องน้ำ (Hong nam)",
        "left": "ซ้าย (Sai)",
        "right": "ขวา (Khwa)",
        "straight": "ตรงไป (Trong pai)",
        "back": "กลับ (Klab)",
        "today": "วันนี้ (Wan nee)",
        "tomorrow": "พรุ่งนี้ (Prung nee)",
        "yesterday": "เมื่อวาน (Mua wan)"
      };
      
      // Check exact match (case insensitive)
      const lowerText = txt.toLowerCase();
      if (thaiDict[lowerText]) {
        return thaiDict[lowerText];
      }
      
      // Check for substrings
      for (const [key, value] of Object.entries(thaiDict)) {
        if (lowerText.includes(key)) {
          return value + " (" + txt + ")";
        }
      }
      
      // Fallback for no match
      return `"${txt}" ในภาษาไทย`;
    };
    
    // Helper function to translate simple text to Vietnamese
    const translateToVietnamese = (txt: string): string => {
      const vietnameseDict: Record<string, string> = {
        "hello": "Xin chào",
        "thank you": "Cảm ơn",
        "yes": "Vâng / Có",
        "no": "Không",
        "excuse me": "Xin lỗi",
        "sorry": "Xin lỗi",
        "good morning": "Chào buổi sáng",
        "good evening": "Chào buổi tối",
        "good night": "Chúc ngủ ngon",
        "goodbye": "Tạm biệt",
        "how are you": "Bạn khỏe không?",
        "i am fine": "Tôi khỏe",
        "what is your name": "Bạn tên gì?",
        "my name is": "Tôi tên là",
        "nice to meet you": "Rất vui được gặp bạn",
        "where is": "Ở đâu",
        "how much": "Bao nhiêu tiền",
        "too expensive": "Quá đắt",
        "cheaper please": "Rẻ hơn được không",
        "delicious": "Ngon",
        "water": "Nước",
        "food": "Thức ăn",
        "restaurant": "Nhà hàng",
        "hotel": "Khách sạn",
        "airport": "Sân bay",
        "train station": "Ga tàu",
        "bus station": "Bến xe buýt",
        "taxi": "Taxi",
        "beach": "Bãi biển",
        "market": "Chợ",
        "shopping mall": "Trung tâm mua sắm",
        "hospital": "Bệnh viện",
        "police station": "Đồn công an",
        "toilet": "Nhà vệ sinh",
        "left": "Trái",
        "right": "Phải",
        "straight": "Thẳng",
        "back": "Quay lại",
        "today": "Hôm nay",
        "tomorrow": "Ngày mai",
        "yesterday": "Hôm qua"
      };
      
      // Check exact match (case insensitive)
      const lowerText = txt.toLowerCase();
      if (vietnameseDict[lowerText]) {
        return vietnameseDict[lowerText];
      }
      
      // Check for substrings
      for (const [key, value] of Object.entries(vietnameseDict)) {
        if (lowerText.includes(key)) {
          return value + " (" + txt + ")";
        }
      }
      
      // Fallback for no match
      return `"${txt}" trong tiếng Việt`;
    };
    
    // Helper function to translate simple text to Khmer (Cambodian)
    const translateToKhmer = (txt: string): string => {
      const khmerDict: Record<string, string> = {
        "hello": "ជំរាបសួរ (Chom reap sour)",
        "thank you": "អរគុណ (Arkoun)",
        "yes": "បាទ/ចាស (Baat/chaa)",
        "no": "ទេ (Te)",
        "excuse me": "សូមទោស (Som toh)",
        "sorry": "សូមទោស (Som toh)",
        "good morning": "អរុណសួស្តី (Arun suostei)",
        "good evening": "សាយ័ណ្ហសួស្តី (Sayonheah suostei)",
        "good night": "រាត្រីសួស្តី (Reatrey suostei)",
        "goodbye": "ជំរាបលា (Chom reap lea)",
        "how are you": "តើអ្នកសុខសប្បាយជាទេ? (Tae anak sok sabbay chea te?)",
        "i am fine": "ខ្ញុំសុខសប្បាយជា (Khnhom sok sabbay chea)",
        "what is your name": "តើអ្នកឈ្មោះអ្វី? (Tae anak chmous avei?)",
        "my name is": "ខ្ញុំឈ្មោះ (Khnhom chmous)",
        "where is": "នៅឯណា (Nov ae na)",
        "how much": "តម្លៃប៉ុន្មាន (Tamlai ponman)",
        "delicious": "ឆ្ងាញ់ (Chhngaignh)",
        "water": "ទឹក (Teuk)",
        "food": "អាហារ (Ahar)",
        "restaurant": "ភោជនីយដ្ឋាន (Phochoneiyoattan)",
        "hotel": "សណ្ឋាគារ (Santhakear)",
        "airport": "អាកាសយានដ្ឋាន (Akasyandthan)",
        "taxi": "តាក់ស៊ី (Taxi)",
        "beach": "ឆ្នេរ (Chhner)",
        "market": "ផ្សារ (Psar)",
        "hospital": "មន្ទីរពេទ្យ (Montipet)",
        "toilet": "បង្គន់ (Bongkon)",
        "left": "ឆ្វេង (Chhveng)",
        "right": "ស្តាំ (Stam)",
        "straight": "ត្រង់ (Trong)",
        "today": "ថ្ងៃនេះ (Tngai nis)",
        "tomorrow": "ថ្ងៃស្អែក (Tngai saaek)",
        "yesterday": "ម្សិលមិញ (Mselmignh)"
      };
      
      // Check exact match (case insensitive)
      const lowerText = txt.toLowerCase();
      if (khmerDict[lowerText]) {
        return khmerDict[lowerText];
      }
      
      // Check for substrings
      for (const [key, value] of Object.entries(khmerDict)) {
        if (lowerText.includes(key)) {
          return value + " (" + txt + ")";
        }
      }
      
      // Fallback for no match
      return `"${txt}" ជាភាសាខ្មែរ`;
    };
    
    // Helper function to translate simple text to Malay
    const translateToMalay = (txt: string): string => {
      const malayDict: Record<string, string> = {
        "hello": "Helo / Hai",
        "thank you": "Terima kasih",
        "yes": "Ya",
        "no": "Tidak",
        "excuse me": "Maafkan saya",
        "sorry": "Maaf",
        "good morning": "Selamat pagi",
        "good evening": "Selamat petang",
        "good night": "Selamat malam",
        "goodbye": "Selamat tinggal",
        "how are you": "Apa khabar?",
        "i am fine": "Saya sihat",
        "what is your name": "Siapa nama anda?",
        "my name is": "Nama saya",
        "nice to meet you": "Senang berjumpa dengan anda",
        "where is": "Di mana",
        "how much": "Berapa harganya",
        "too expensive": "Terlalu mahal",
        "delicious": "Sedap",
        "water": "Air",
        "food": "Makanan",
        "restaurant": "Restoran",
        "hotel": "Hotel",
        "airport": "Lapangan terbang",
        "train station": "Stesen kereta api",
        "bus station": "Stesen bas",
        "taxi": "Teksi",
        "beach": "Pantai",
        "market": "Pasar",
        "shopping mall": "Pusat beli-belah",
        "hospital": "Hospital",
        "police station": "Balai polis",
        "toilet": "Tandas",
        "left": "Kiri",
        "right": "Kanan",
        "straight": "Terus",
        "back": "Belakang",
        "today": "Hari ini",
        "tomorrow": "Esok",
        "yesterday": "Semalam"
      };
      
      // Check exact match (case insensitive)
      const lowerText = txt.toLowerCase();
      if (malayDict[lowerText]) {
        return malayDict[lowerText];
      }
      
      // Check for substrings
      for (const [key, value] of Object.entries(malayDict)) {
        if (lowerText.includes(key)) {
          return value + " (" + txt + ")";
        }
      }
      
      // Fallback for no match
      return `"${txt}" dalam Bahasa Melayu`;
    };
    
    // Process translation request
    setTimeout(() => {
      let result = "";
      
      // Check if we have a predefined translation for this phrase
      if (commonResponses[target] && commonResponses[target][text]) {
        // Direct match found in our built-in dictionary
        result = commonResponses[target][text];
      } else {
        // Use language-specific translation function
        if (target === "th") {
          result = translateToThai(text);
        } else if (target === "vi") {
          result = translateToVietnamese(text);
        } else if (target === "km") {
          result = translateToKhmer(text);
        } else if (target === "ms") {
          result = translateToMalay(text);
        } else {
          // For other languages, provide a basic transliteration
          const transliterations: Record<string, (t: string) => string> = {
            fil: (t) => `"${t}" sa Filipino`,
            lo: (t) => `"${t}" ໃນພາສາລາວ`,
            my: (t) => `"${t}" မြန်မာဘာသာဖြင့်`,
            id: (t) => `"${t}" dalam Bahasa Indonesia`
          };
          
          if (transliterations[target]) {
            result = transliterations[target](text);
          } else {
            result = `[${getLanguageName(target)}]: ${text}`;
          }
        }
      }
      
      setTranslatedText(result);
      setIsTranslating(false);
      
      // Add to conversation history
      if (text.trim() !== "") {
        setConversationHistory(prev => [
          {
            original: text,
            translated: result,
            sourceLanguage: source,
            targetLanguage: target,
            timestamp: new Date()
          },
          ...prev
        ]);
      }
    }, 800);
  };

  const handleTranslate = () => {
    if (inputText.trim() !== "") {
      simulateTranslation(inputText, sourceLanguage, targetLanguage);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // Also swap the text if there's already a translation
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const handleSavePhrase = () => {
    if (inputText.trim() !== "" && translatedText.trim() !== "") {
      setSavedPhrases(prev => [
        ...prev,
        {
          original: inputText,
          translated: translatedText,
          sourceLanguage,
          targetLanguage,
          category: newPhraseCategory
        }
      ]);
    }
  };

  const handleClearHistory = () => {
    setConversationHistory([]);
  };

  const handleUsePhrase = (original: string, translated: string, source: string, target: string) => {
    setInputText(original);
    setTranslatedText(translated);
    setSourceLanguage(source);
    setTargetLanguage(target);
    setActiveTab("translate");
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // Voice recognition functionality
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    setIsListening(true);
    setVoiceDetected(false);
    setVoiceText("");
    
    // Simulate voice detection after a short delay
    setTimeout(() => {
      setVoiceDetected(true);
      // Simulate transcribing
      let transcriptionProgress = "";
      const phrases = [
        "Hello",
        "Hello, how are you?",
        "Hello, how are you? Can you help me?",
        "Hello, how are you? Can you help me find the nearest restaurant?"
      ];
      
      let phraseIndex = 0;
      const transcriptionInterval = setInterval(() => {
        if (phraseIndex < phrases.length) {
          transcriptionProgress = phrases[phraseIndex];
          setVoiceText(transcriptionProgress);
          phraseIndex++;
        } else {
          clearInterval(transcriptionInterval);
          stopListening();
          simulateTranslation(transcriptionProgress, sourceLanguage, targetLanguage);
        }
      }, 800);
    }, 1000);
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  // Camera translation functionality
  const activateCamera = () => {
    setCameraActive(true);
  };
  
  const captureImage = () => {
    // In a real implementation, this would access the device camera
    // For simulation, we'll use a sample image
    setCameraActive(false);
    setIsProcessingImage(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Sample image (base64 encoded)
      const sampleImage = "https://images.unsplash.com/photo-1546407341-a9fd63f9a42a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhaSUyMG1lbnV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
      setImagePreview(sampleImage);
      
      // Simulate text extraction
      setImageText("อาหารไทย - Thai Food Menu\nต้มยำกุ้ง - Tom Yum Goong - 250฿\nผัดไทย - Pad Thai - 150฿\nข้าวผัด - Fried Rice - 120฿");
      setIsProcessingImage(false);
      
      // Auto translate the extracted text
      setInputText("อาหารไทย - Thai Food Menu\nต้มยำกุ้ง - Tom Yum Goong - 250฿\nผัดไทย - Pad Thai - 150฿\nข้าวผัด - Fried Rice - 120฿");
      simulateTranslation("อาหารไทย - Thai Food Menu\nต้มยำกุ้ง - Tom Yum Goong - 250฿\nผัดไทย - Pad Thai - 150฿\nข้าวผัด - Fried Rice - 120฿", "th", "en");
    }, 2000);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessingImage(true);
    
    // Create file preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      
      // Simulate text extraction after a delay
      setTimeout(() => {
        // Sample extracted text (would be real OCR in production)
        setImageText("Restaurant Menu\nAppetizers\nSpring Rolls - $5.99\nSatay Chicken - $7.99\nMain Dishes\nPad Thai - $12.99\nGreen Curry - $14.99");
        setIsProcessingImage(false);
        
        // Auto translate
        setInputText("Restaurant Menu\nAppetizers\nSpring Rolls - $5.99\nSatay Chicken - $7.99\nMain Dishes\nPad Thai - $12.99\nGreen Curry - $14.99");
        simulateTranslation("Restaurant Menu\nAppetizers\nSpring Rolls - $5.99\nSatay Chicken - $7.99\nMain Dishes\nPad Thai - $12.99\nGreen Curry - $14.99", "en", targetLanguage);
      }, 2000);
    };
    
    reader.readAsDataURL(file);
  };

  // Function to get language name from code
  const getLanguageName = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  // Set up some initial saved phrases for demonstration
  useEffect(() => {
    if (savedPhrases.length === 0) {
      setSavedPhrases([
        {
          original: "Where is the nearest hospital?",
          translated: "โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน",
          sourceLanguage: "en",
          targetLanguage: "th",
          category: "emergency"
        },
        {
          original: "How much does this cost?",
          translated: "อันนี้ราคาเท่าไหร่",
          sourceLanguage: "en",
          targetLanguage: "th",
          category: "shopping"
        },
        {
          original: "I'm allergic to peanuts",
          translated: "ฉันแพ้ถั่วลิสง",
          sourceLanguage: "en",
          targetLanguage: "th",
          category: "food"
        }
      ]);
    }
  }, [savedPhrases.length]);

  // Auto-scroll to the bottom of conversation history when new messages are added
  useEffect(() => {
    if (outputRef.current && activeTab === "translate") {
      outputRef.current.scrollTop = 0;
    }
  }, [conversationHistory, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Translate - Trv Bud</title>
        <meta name="description" content="Translate phrases and have conversations in Southeast Asian languages with advanced translation features." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Translate</h1>
      <p className="text-neutral-500 mb-8">Communicate easily in Southeast Asian countries with advanced translation tools</p>
      
      <Tabs defaultValue="translate" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="translate" className="flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center">
            <Mic className="h-4 w-4 mr-2" />
            <span>Voice</span>
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <span>Camera</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <ListPlus className="h-4 w-4 mr-2" />
            <span>Saved</span>
          </TabsTrigger>
          <TabsTrigger value="common" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>Common</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="flex-1 flex items-center">
                      <Mic className="h-5 w-5 mr-2 text-primary" />
                      <span>Voice Translation</span>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-primary/5">
                      Speech Recognition
                    </Badge>
                  </CardTitle>
                  <CardDescription>Speak and translate between Southeast Asian languages</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap mb-4 gap-2">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Speak in</label>
                      <Select 
                        value={sourceLanguage} 
                        onValueChange={setSourceLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end mb-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSwapLanguages}
                        className="rounded-full"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Translate to</label>
                      <Select 
                        value={targetLanguage} 
                        onValueChange={setTargetLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="conversation-mode"
                            checked={conversationMode}
                            onChange={() => setConversationMode(!conversationMode)}
                            className="mr-2"
                          />
                          <label htmlFor="conversation-mode" className="text-sm font-medium">
                            Conversation Mode
                          </label>
                        </div>
                        {conversationMode && (
                          <p className="text-xs text-neutral-500">
                            Will automatically detect language and translate back and forth
                          </p>
                        )}
                      </div>
                      
                      <Button
                        onClick={toggleListening}
                        size="lg"
                        className={isListening ? "bg-error hover:bg-error/90" : ""}
                      >
                        {isListening ? (
                          <>
                            <PauseCircle className="h-5 w-5 mr-2" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5 mr-2" />
                            Start Speaking
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-2 transition-all min-h-[150px] ${isListening ? "border-primary animate-pulse" : "border-neutral-200"}`}>
                      {isListening ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          {!voiceDetected ? (
                            <>
                              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                                  <Mic className="h-6 w-6 text-primary" />
                                </div>
                              </div>
                              <p className="text-neutral-500">Listening...</p>
                            </>
                          ) : (
                            <>
                              <div className="w-full">
                                <p className="text-neutral-400 text-sm mb-2">Detected speech:</p>
                                <p className="font-medium">{voiceText}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                          <Mic className="h-8 w-8 mb-2 opacity-30" />
                          <p>Tap "Start Speaking" and say something</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {translatedText && activeTab === "voice" && (
                    <div className="border rounded-md p-3 bg-neutral-50 relative">
                      <div className="text-sm text-neutral-500 mb-1">
                        Translation ({getLanguageName(targetLanguage)}):
                      </div>
                      <div className="text-lg font-medium mb-2">{translatedText}</div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => speakText(translatedText, targetLanguage)}
                        >
                          <VolumeIcon className="h-4 w-4 mr-1" /> Listen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(translatedText)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSavePhrase}
                        >
                          <ListPlus className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                    Voice Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Speaking Tips</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Speak clearly and at a moderate pace</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Reduce background noise when possible</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Use short, simple sentences for better accuracy</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Try the conversation mode for natural back-and-forth</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                      <p className="font-medium text-amber-800 mb-1">In Conversation Mode:</p>
                      <p className="text-amber-700">
                        After your speech is translated, the app will automatically speak the translation aloud, making it perfect for real conversations with locals.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="camera">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="flex-1 flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-primary" />
                      <span>Camera Translation</span>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-primary/5">
                      Text Recognition
                    </Badge>
                  </CardTitle>
                  <CardDescription>Translate text from images and camera</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap mb-4 gap-2">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Source language</label>
                      <Select 
                        value={sourceLanguage} 
                        onValueChange={setSourceLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end mb-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSwapLanguages}
                        className="rounded-full"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Translate to</label>
                      <Select 
                        value={targetLanguage} 
                        onValueChange={setTargetLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    {cameraActive ? (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center mb-4">
                        <div className="text-white w-full h-full flex flex-col items-center justify-center">
                          <Camera className="h-10 w-10 mb-2" />
                          <p>Camera Preview (simulated)</p>
                          
                          <Button 
                            onClick={captureImage}
                            className="mt-4"
                            size="lg"
                          >
                            <Camera className="h-5 w-5 mr-2" />
                            Capture
                          </Button>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <div className="mb-4">
                        <div className="relative rounded-lg overflow-hidden mb-3">
                          <img 
                            src={imagePreview} 
                            alt="Captured" 
                            className="w-full object-contain max-h-[300px]" 
                          />
                        </div>
                        
                        {isProcessingImage ? (
                          <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                            <span>Extracting text...</span>
                          </div>
                        ) : (
                          <div className="border rounded-md p-3 bg-neutral-50 relative mb-3">
                            <div className="text-sm text-neutral-500 mb-1">
                              Extracted text:
                            </div>
                            <div className="text-sm font-medium whitespace-pre-line mb-2">
                              {imageText}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setImagePreview(null);
                              setImageText("");
                            }}
                          >
                            New Capture
                          </Button>
                          <Button 
                            onClick={activateCamera}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Camera
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Camera className="h-10 w-10 text-neutral-300" />
                          <div>
                            <h3 className="text-neutral-600 font-medium mb-1">Capture or Upload Image</h3>
                            <p className="text-neutral-400 text-sm mb-3">Take a photo of text to translate or upload an image</p>
                          </div>
                          <div className="flex flex-wrap justify-center gap-2">
                            <Button
                              onClick={activateCamera}
                            >
                              <Camera className="h-4 w-4 mr-1" />
                              Use Camera
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FileImage className="h-4 w-4 mr-1" />
                              Upload Image
                            </Button>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              accept="image/*"
                              className="hidden" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {translatedText && activeTab === "camera" && !isProcessingImage && (
                    <div className="border rounded-md p-3 bg-neutral-50 relative">
                      <div className="text-sm text-neutral-500 mb-1">
                        Translation ({getLanguageName(targetLanguage)}):
                      </div>
                      <div className="text-sm font-medium whitespace-pre-line mb-2">{translatedText}</div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => speakText(translatedText, targetLanguage)}
                        >
                          <VolumeIcon className="h-4 w-4 mr-1" /> Listen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(translatedText)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSavePhrase}
                        >
                          <ListPlus className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-primary" />
                    Camera Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Best Practices</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Ensure good lighting for clear text capture</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Hold camera steady for better results</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Frame text properly in the camera view</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Works with signs, menus, and printed materials</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                      <p className="font-medium text-amber-800 mb-1">Great for travels!</p>
                      <p className="text-amber-700">
                        Use camera translation for restaurant menus, street signs, information boards, and other text you encounter while traveling.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="translate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="flex-1 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" />
                      <span>Text Translation</span>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-primary/5">
                      Built-in Dictionary
                    </Badge>
                  </CardTitle>
                  <CardDescription>Translate between Southeast Asian languages and more</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap mb-4 gap-2">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Translate from</label>
                      <Select 
                        value={sourceLanguage} 
                        onValueChange={setSourceLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end mb-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleSwapLanguages}
                        className="rounded-full"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Translate to</label>
                      <Select 
                        value={targetLanguage} 
                        onValueChange={setTargetLanguage}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-500 mb-1">Enter text</label>
                    <div className="relative">
                      <Textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleEnterKey}
                        placeholder="Type or paste text to translate"
                        className="min-h-[100px] pr-10"
                      />
                      <button 
                        onClick={() => speakText(inputText, sourceLanguage)}
                        className="absolute right-2 bottom-2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                        title="Listen"
                      >
                        <VolumeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleTranslate} 
                    disabled={isTranslating || inputText.trim() === ""}
                    className="w-full mb-4"
                  >
                    {isTranslating ? "Translating..." : "Translate"}
                  </Button>
                  
                  {translatedText && (
                    <div className="border rounded-md p-3 bg-neutral-50 relative">
                      <div className="text-sm text-neutral-500 mb-1">
                        Translation ({getLanguageName(targetLanguage)}):
                      </div>
                      <div className="text-lg font-medium mb-2">{translatedText}</div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => speakText(translatedText, targetLanguage)}
                        >
                          <VolumeIcon className="h-4 w-4 mr-1" /> Listen
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(translatedText)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSavePhrase}
                        >
                          <ListPlus className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </div>
                      
                      {translatedText && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-neutral-500 mb-1">Save to category</label>
                          <div className="flex space-x-2">
                            <Select 
                              value={newPhraseCategory} 
                              onValueChange={setNewPhraseCategory}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {phraseCategories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {conversationHistory.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <History className="h-5 w-5 mr-2 text-neutral-500" />
                        <span>Recent Translations</span>
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClearHistory}
                        className="text-neutral-500 hover:text-neutral-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto" ref={outputRef}>
                      {conversationHistory.map((item, index) => (
                        <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-sm text-neutral-500">
                              {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                            </div>
                            <div className="text-xs text-neutral-400">
                              {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <div className="text-sm font-medium">{item.original}</div>
                              <div className="text-sm text-primary mt-1">{item.translated}</div>
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleUsePhrase(item.original, item.translated, item.sourceLanguage, item.targetLanguage)}
                                className="text-xs"
                              >
                                Use Again
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <GlobeIcon className="h-5 w-5 mr-2 text-primary" />
                    Translation Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Southeast Asian Language Tips</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Thai and Lao are tonal languages - pronunciation matters!</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Vietnamese uses Latin alphabet with tone marks</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Khmer (Cambodian) has its own unique script</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>In many Southeast Asian cultures, a slight bow with "wai" gesture shows respect</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Best Practices</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Keep phrases short and simple</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Save important phrases for offline use</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Use visuals and hand gestures to reinforce meaning</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>Download Google Translate offline packs before travel</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                      <p className="font-medium text-amber-800 mb-1">Connectivity Tip:</p>
                      <p className="text-amber-700">
                        Download offline translation packs from Google Translate app before your trip to use without internet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListPlus className="h-5 w-5 mr-2 text-primary" />
                Saved Phrases
              </CardTitle>
              <CardDescription>Your saved translations for quick access</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="flex flex-wrap h-auto mb-4">
                  <TabsTrigger value="all" className="mb-1">All</TabsTrigger>
                  {phraseCategories.map(category => (
                    <TabsTrigger 
                      key={category.value}
                      value={category.value}
                      className="mb-1"
                      disabled={!savedPhrases.some(phrase => phrase.category === category.value)}
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all">
                  {savedPhrases.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                      <p>No saved phrases yet. Translate and save phrases for quick access.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedPhrases.map((phrase, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="bg-neutral-100 border-0 text-xs">
                                {phraseCategories.find(cat => cat.value === phrase.category)?.label || phrase.category}
                              </Badge>
                              <span className="text-xs text-neutral-400">
                                {getLanguageName(phrase.sourceLanguage)} → {getLanguageName(phrase.targetLanguage)}
                              </span>
                            </div>
                            <div className="mb-3">
                              <div className="font-medium">{phrase.original}</div>
                              <div className="text-primary text-sm mt-1">{phrase.translated}</div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => speakText(phrase.translated, phrase.targetLanguage)}
                              >
                                <VolumeIcon className="h-3 w-3 mr-1" />
                                Listen
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(phrase.translated)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleUsePhrase(phrase.original, phrase.translated, phrase.sourceLanguage, phrase.targetLanguage)}
                              >
                                Use
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {phraseCategories.map(category => (
                  <TabsContent key={category.value} value={category.value}>
                    <div className="space-y-4">
                      {savedPhrases
                        .filter(phrase => phrase.category === category.value)
                        .map((phrase, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-neutral-400">
                                  {getLanguageName(phrase.sourceLanguage)} → {getLanguageName(phrase.targetLanguage)}
                                </span>
                              </div>
                              <div className="mb-3">
                                <div className="font-medium">{phrase.original}</div>
                                <div className="text-primary text-sm mt-1">{phrase.translated}</div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => speakText(phrase.translated, phrase.targetLanguage)}
                                >
                                  <VolumeIcon className="h-3 w-3 mr-1" />
                                  Listen
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(phrase.translated)}
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleUsePhrase(phrase.original, phrase.translated, phrase.sourceLanguage, phrase.targetLanguage)}
                                >
                                  Use
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="common">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                    Common Travel Phrases
                  </CardTitle>
                  <CardDescription>Essential phrases for Southeast Asian travel</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-500 whitespace-nowrap">Translate to:</span>
                  <Select 
                    value={targetLanguage} 
                    onValueChange={setTargetLanguage}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(l => l.code !== "en").map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="greetings">
                <TabsList className="flex flex-wrap h-auto mb-4">
                  {Object.keys(commonPhrases).map(category => (
                    <TabsTrigger 
                      key={category}
                      value={category}
                      className="mb-1"
                    >
                      {phraseCategories.find(cat => cat.value === category)?.label || category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(commonPhrases).map(([category, phrases]) => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-4">
                      {phrases.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">{item.phrase}</div>
                              <Badge variant="outline" className="text-xs bg-neutral-50">
                                {item.context}
                              </Badge>
                            </div>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setInputText(item.phrase);
                                setSourceLanguage("en");
                                simulateTranslation(item.phrase, "en", targetLanguage);
                                setActiveTab("translate");
                              }}
                            >
                              Translate to {getLanguageName(targetLanguage)}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            
            <CardFooter className="bg-neutral-50 border-t">
              <div className="text-sm text-neutral-500">
                <p>These phrases are commonly used by travelers in Southeast Asia. Select any phrase to translate it to your preferred language.</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleTranslate;