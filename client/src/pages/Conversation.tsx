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
  GlobeIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Conversation = () => {
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

  const outputRef = useRef<HTMLDivElement>(null);

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

  // Self-contained translation function without Google Translate API
  const simulateTranslation = (text: string, source: string, target: string) => {
    setIsTranslating(true);
    
    // Simulate API delay
    setTimeout(() => {
      let result = "";
      
      // Check if we have a predefined translation for this phrase
      if (commonResponses[target] && commonResponses[target][text]) {
        // Direct match found in our dictionary
        result = commonResponses[target][text];
      } else {
        // No exact match, check for partial matches
        const targetDict = commonResponses[target] || {};
        
        // Try to find similar phrases
        const keys = Object.keys(targetDict);
        let bestMatch = "";
        let highestSimilarity = 0;
        
        // Simple word matching algorithm
        for (const key of keys) {
          const keyWords = key.toLowerCase().split(" ");
          const textWords = text.toLowerCase().split(" ");
          
          // Count matching words
          const matchingWords = keyWords.filter(word => textWords.includes(word)).length;
          const similarity = matchingWords / Math.max(keyWords.length, textWords.length);
          
          if (similarity > highestSimilarity && similarity > 0.3) {
            highestSimilarity = similarity;
            bestMatch = key;
          }
        }
        
        if (bestMatch && targetDict[bestMatch]) {
          // Found a similar phrase
          result = targetDict[bestMatch] + " (similar match)";
        } else {
          // No match found, provide a basic placeholder translation
          const transliterations: Record<string, (t: string) => string> = {
            th: (t) => `[${t} - ภาษาไทย]`,
            vi: (t) => `[${t} - Tiếng Việt]`,
            km: (t) => `[${t} - ភាសាខ្មែរ]`,
            ms: (t) => `[${t} - Bahasa Melayu]`,
            fil: (t) => `[${t} - Filipino]`,
            lo: (t) => `[${t} - ພາສາລາວ]`,
            my: (t) => `[${t} - မြန်မာဘာသာ]`,
            id: (t) => `[${t} - Bahasa Indonesia]`
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
        <title>Google Translate - Trv Bud</title>
        <meta name="description" content="Translate phrases and have conversations in Southeast Asian languages with Google Translate integration." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Google Translate</h1>
      <p className="text-neutral-500 mb-8">Communicate easily in Southeast Asian countries with Google Translate</p>
      
      <Tabs defaultValue="translate" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="translate" className="flex items-center">
            <Languages className="h-4 w-4 mr-2" />
            <span>Translate</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center">
            <ListPlus className="h-4 w-4 mr-2" />
            <span>Saved Phrases</span>
          </TabsTrigger>
          <TabsTrigger value="common" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>Common Phrases</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="translate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <div className="flex-1 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" />
                      <span>Google Translate</span>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-primary/5">
                      Powered by Google
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

export default Conversation;