import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, FileCheck, Calendar, AlertCircle, Clock, FileText, Map, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type VisaRequirement = {
  country: string;
  flagEmoji: string;
  officialName: string;
  visaTypes: {
    type: string;
    duration: string;
    processingTime: string;
    cost: string;
    requirements: string[];
  }[];
  officialWebsite: string;
  notes: string;
  eVisaAvailable: boolean;
  visaFreeCountries: string[];
};

const Visas = () => {
  const visaRequirements: VisaRequirement[] = [
    {
      country: "Vietnam",
      flagEmoji: "🇻🇳",
      officialName: "Immigration Department of Vietnam",
      visaTypes: [
        {
          type: "Tourist eVisa",
          duration: "Single entry: up to 30 days",
          processingTime: "3-5 working days",
          cost: "$25 USD",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed online visa application form",
            "Recent passport-sized digital photograph (4x6 cm)",
            "Digital copy of passport data page",
            "Flight itinerary (round trip)",
            "Hotel reservations",
            "Credit/debit card for payment"
          ]
        },
        {
          type: "Tourist Visa (Embassy/Consulate)",
          duration: "Single entry: up to 30 days; Multiple entry: up to 90 days",
          processingTime: "4-7 working days",
          cost: "$25-65 USD (varies by type)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Invitation letter from Vietnam-based sponsor (for business/longer stays)",
            "Flight itinerary (round trip)",
            "Proof of sufficient funds",
            "Travel insurance (recommended)"
          ]
        }
      ],
      officialWebsite: "https://evisa.xuatnhapcanh.gov.vn/",
      notes: "Vietnam has recently expanded its e-visa system to citizens of all countries. The e-visa is valid for single-entry stays of up to 30 days.",
      eVisaAvailable: true,
      visaFreeCountries: ["Thailand", "Malaysia", "Singapore", "Indonesia", "Philippines", "Laos", "Cambodia", "Myanmar", "Brunei", "South Korea", "Japan", "Russia", "Belarus", "Norway", "Denmark", "Sweden", "Finland"]
    },
    {
      country: "Cambodia",
      flagEmoji: "🇰🇭",
      officialName: "Ministry of Foreign Affairs and International Cooperation, Cambodia",
      visaTypes: [
        {
          type: "Tourist eVisa",
          duration: "Single entry: up to 30 days",
          processingTime: "3 working days",
          cost: "$36 USD",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed online visa application form",
            "Recent digital passport photo",
            "Credit/debit card for payment"
          ]
        },
        {
          type: "Tourist Visa on Arrival",
          duration: "Single entry: up to 30 days",
          processingTime: "Same day at airport/border crossing",
          cost: "$30 USD",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form (available at entry points)",
            "Recent passport-sized color photograph",
            "Cash payment in USD"
          ]
        },
        {
          type: "Business Visa (E-class)",
          duration: "Initial 30 days, extendable for 1, 3, 6, or 12 months",
          processingTime: "Same day at airport/border crossing",
          cost: "$35 USD (initial 30 days)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Cash payment in USD"
          ]
        }
      ],
      officialWebsite: "https://www.evisa.gov.kh/",
      notes: "Cambodia offers visa on arrival at major entry points, including international airports in Phnom Penh and Siem Reap, and major land border crossings.",
      eVisaAvailable: true,
      visaFreeCountries: ["Laos", "Malaysia", "Philippines", "Singapore", "Vietnam", "Thailand", "Indonesia", "Myanmar", "Brunei"]
    },
    {
      country: "Malaysia",
      flagEmoji: "🇲🇾",
      officialName: "Immigration Department of Malaysia",
      visaTypes: [
        {
          type: "eVISA",
          duration: "Single entry: up to 30 days",
          processingTime: "48-72 hours",
          cost: "$20-35 USD (varies by nationality)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed online visa application form",
            "Recent passport-sized digital photograph",
            "Confirmed flight tickets (return/onward)",
            "Proof of accommodation",
            "Credit/debit card for payment"
          ]
        },
        {
          type: "Multiple Entry Visa",
          duration: "Multiple entries: up to 30 days per visit (valid for 3-12 months)",
          processingTime: "5-7 working days",
          cost: "$20-100 USD (varies by nationality)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (return/onward)",
            "Proof of accommodation",
            "Proof of sufficient funds",
            "Travel insurance (recommended)"
          ]
        }
      ],
      officialWebsite: "https://www.imi.gov.my/portal2017/index.php/en/",
      notes: "Malaysia offers visa-free entry for citizens of many countries for stays ranging from 14 to 90 days, depending on nationality.",
      eVisaAvailable: true,
      visaFreeCountries: ["United States", "United Kingdom", "Canada", "Australia", "European Union countries", "South Korea", "Japan", "Singapore", "Thailand", "Brunei"]
    },
    {
      country: "South Korea",
      flagEmoji: "🇰🇷",
      officialName: "Ministry of Foreign Affairs, Republic of Korea",
      visaTypes: [
        {
          type: "Tourist Visa (C-3-9)",
          duration: "Up to 90 days",
          processingTime: "5-10 working days",
          cost: "$40-60 USD",
          requirements: [
            "Valid passport with at least 6 months validity",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Proof of sufficient funds",
            "Flight itinerary (round trip)",
            "Hotel reservations",
            "Travel insurance (recommended)"
          ]
        },
        {
          type: "K-ETA (Electronic Travel Authorization)",
          duration: "Multiple entries for up to 90 days per stay (valid for 2 years)",
          processingTime: "24-72 hours",
          cost: "$10 USD",
          requirements: [
            "Valid passport with at least 6 months validity",
            "Valid email address",
            "Credit/debit card for payment",
            "Recent digital photograph"
          ]
        }
      ],
      officialWebsite: "https://www.visa.go.kr/main/openMain.do",
      notes: "K-ETA is available for citizens of visa-free countries. Apply at least 72 hours before departure.",
      eVisaAvailable: true,
      visaFreeCountries: ["United States", "Canada", "Australia", "United Kingdom", "European Union countries", "New Zealand", "Singapore"]
    },
    {
      country: "China",
      flagEmoji: "🇨🇳",
      officialName: "Ministry of Foreign Affairs of the People's Republic of China",
      visaTypes: [
        {
          type: "L Visa (Tourist)",
          duration: "Single entry: 30-90 days; Double entry: 30-90 days per entry; Multiple entry: 30-90 days per entry, valid for 6 months, 1 year, or 10 years",
          processingTime: "4-10 working days",
          cost: "$30-140 USD (varies by nationality and number of entries)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (round trip)",
            "Hotel reservations",
            "Detailed travel itinerary",
            "Proof of sufficient funds",
            "Travel insurance (recommended)"
          ]
        },
        {
          type: "M Visa (Business)",
          duration: "Single entry: 30-90 days; Double entry: 30-90 days per entry; Multiple entry: 30-90 days per entry, valid for 6 months, 1 year, or 10 years",
          processingTime: "4-10 working days",
          cost: "$30-140 USD (varies by nationality and number of entries)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Invitation letter from Chinese business/trade partner",
            "Business license of the inviting company",
            "Flight itinerary (round trip)",
            "Hotel reservations"
          ]
        }
      ],
      officialWebsite: "https://english.www.gov.cn/services/visitchina",
      notes: "China has resumed 15-day visa-free transit for certain nationalities at specific entry points. Check the latest policy before travel.",
      eVisaAvailable: true,
      visaFreeCountries: ["Singapore", "Brunei", "Japan (for business and tourism up to 15 days)"]
    },
    {
      country: "Thailand",
      flagEmoji: "🇹🇭",
      officialName: "Ministry of Foreign Affairs of the Kingdom of Thailand",
      visaTypes: [
        {
          type: "Tourist Visa (TR)",
          duration: "Single entry: up to 60 days (can be extended for 30 days); Multiple entry: up to 60 days per entry (valid for 6 months)",
          processingTime: "2-5 working days",
          cost: "$40-60 USD",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (round trip)",
            "Proof of accommodation",
            "Proof of sufficient funds (20,000 THB per person, 40,000 THB per family)",
            "Travel insurance with COVID-19 coverage (minimum $10,000 USD)"
          ]
        },
        {
          type: "Special Tourist Visa (STV)",
          duration: "Up to 90 days (renewable twice, total stay up to 270 days)",
          processingTime: "3-7 working days",
          cost: "$65-100 USD",
          requirements: [
            "Valid passport with at least 12 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (round trip)",
            "Proof of accommodation for entire stay",
            "Travel insurance with COVID-19 coverage (minimum $100,000 USD)",
            "Proof of sufficient funds"
          ]
        }
      ],
      officialWebsite: "https://www.thaiembassy.com/thailand-visa/",
      notes: "Thailand offers visa exemptions for citizens of 57 countries for stays of 30-90 days. eVisa application is available for tourist and business visits.",
      eVisaAvailable: true,
      visaFreeCountries: ["United States", "Canada", "Australia", "United Kingdom", "European Union countries", "Japan", "South Korea", "Singapore", "Malaysia"]
    },
    {
      country: "Singapore",
      flagEmoji: "🇸🇬",
      officialName: "Immigration & Checkpoints Authority (ICA) of Singapore",
      visaTypes: [
        {
          type: "Tourist Visa",
          duration: "Up to 30 days (can vary by nationality)",
          processingTime: "3-5 working days",
          cost: "$30 SGD",
          requirements: [
            "Valid passport with at least 6 months validity",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (round trip)",
            "Hotel reservations",
            "Proof of sufficient funds",
            "Travel insurance (recommended)"
          ]
        },
        {
          type: "Business Visa",
          duration: "Up to 30 days (can vary by nationality)",
          processingTime: "3-5 working days",
          cost: "$30 SGD",
          requirements: [
            "Valid passport with at least 6 months validity",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Letter of introduction from employer",
            "Letter of invitation from Singaporean company",
            "Flight itinerary (round trip)",
            "Hotel reservations"
          ]
        }
      ],
      officialWebsite: "https://www.ica.gov.sg/enter-depart/entry_requirements",
      notes: "Singapore offers visa-free entry for citizens of about 150 countries for visits ranging from 30 to 90 days.",
      eVisaAvailable: true,
      visaFreeCountries: ["United States", "Canada", "Australia", "United Kingdom", "European Union countries", "Japan", "South Korea", "New Zealand", "Malaysia"]
    },
    {
      country: "Hong Kong",
      flagEmoji: "🇭🇰",
      officialName: "Immigration Department, The Government of Hong Kong Special Administrative Region",
      visaTypes: [
        {
          type: "Visitor Visa",
          duration: "14-90 days (varies by nationality)",
          processingTime: "4-6 weeks",
          cost: "HK$230 ($30 USD)",
          requirements: [
            "Valid passport with at least 6 months validity and blank visa pages",
            "Completed visa application form",
            "Recent passport-sized color photograph",
            "Flight itinerary (round trip)",
            "Proof of accommodation",
            "Proof of sufficient funds",
            "Travel insurance (recommended)"
          ]
        }
      ],
      officialWebsite: "https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html",
      notes: "Hong Kong offers visa-free entry for citizens of about 170 countries and territories for stays ranging from 7 to 180 days.",
      eVisaAvailable: true,
      visaFreeCountries: ["United States", "Canada", "Australia", "United Kingdom", "European Union countries", "Japan", "South Korea", "Singapore", "Malaysia", "New Zealand"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Visa Requirements for East Asia - Trv Bud</title>
        <meta name="description" content="Comprehensive information about visa requirements for traveling to East Asian countries including Japan, China, South Korea, Thailand, Singapore, and more." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">East Asia Visa Requirements</h1>
      <p className="text-neutral-500 mb-8">Essential visa information for travelers to East Asian destinations</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="h-5 w-5 mr-2 text-primary" />
            Visa Information Center
          </CardTitle>
          <CardDescription>
            Find official visa requirements, application processes, and direct links to immigration departments for East Asian countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Important Travel Advisory</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Visa requirements can change frequently. Always verify information with the official embassy or consulate of your destination country before planning your trip.
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue={visaRequirements[0].country.toLowerCase()}>
            <TabsList className="mb-6 flex flex-wrap h-auto">
              {visaRequirements.map((country) => (
                <TabsTrigger 
                  key={country.country}
                  value={country.country.toLowerCase()}
                  className="data-[state=active]:bg-primary/10 mb-2"
                >
                  <span className="mr-2">{country.flagEmoji}</span>
                  {country.country}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {visaRequirements.map((country) => (
              <TabsContent 
                key={country.country}
                value={country.country.toLowerCase()}
                className="border-t pt-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <span className="mr-2">{country.flagEmoji}</span>
                      {country.country}
                    </h2>
                    <p className="text-neutral-500">{country.officialName}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Button variant="outline" className="flex items-center" asChild>
                      <a href={country.officialWebsite} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Official Website
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Key Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 mr-2 text-neutral-500 mt-1" />
                          <div>
                            <span className="font-medium">eVisa Available:</span>{" "}
                            <span className={country.eVisaAvailable ? "text-green-600" : "text-red-600"}>
                              {country.eVisaAvailable ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Map className="h-4 w-4 mr-2 text-neutral-500 mt-1" />
                          <div>
                            <span className="font-medium">Visa-Free Access:</span>{" "}
                            <span className="text-neutral-600">
                              For {country.visaFreeCountries.length} countries/territories
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 text-neutral-500 mt-1" />
                          <div>
                            <span className="font-medium">Special Notes:</span>{" "}
                            <span className="text-neutral-600">{country.notes}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Visa-Free Countries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {country.visaFreeCountries.map((c, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/5">
                            {c}
                          </Badge>
                        ))}
                        {country.visaFreeCountries.length > 8 && (
                          <Badge variant="outline" className="bg-neutral-100">
                            +more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Visa Types & Requirements</h3>
                
                <div className="space-y-6">
                  {country.visaTypes.map((visa, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{visa.type}</CardTitle>
                          <Badge className="bg-primary text-white border-0">
                            {visa.cost}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 text-neutral-500 mt-1" />
                            <div>
                              <span className="text-xs text-neutral-500 block">Duration</span>
                              <span className="font-medium">{visa.duration}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Clock className="h-4 w-4 mr-2 text-neutral-500 mt-1" />
                            <div>
                              <span className="text-xs text-neutral-500 block">Processing Time</span>
                              <span className="font-medium">{visa.processingTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-sm mb-2">Required Documents:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {visa.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-neutral-700">{req}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Visa Application Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm">Apply at least 2-3 weeks before travel</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm">Make copies of all documents</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm">Ensure passport has at least 6 months validity</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm">Check specific photo requirements</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <span className="text-sm">Provide detailed travel itinerary</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Embassy Locator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500 mb-4">
              Find the nearest embassy or consulate to apply for your visa in person:
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.vietnam-briefing.com/news/vietnam-visa-guide-requirements-application-exemptions.html/" target="_blank" rel="noopener noreferrer">
                  <span className="mr-2">🇻🇳</span> Vietnam Embassies & Consulates
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.china-embassy.gov.cn/eng/" target="_blank" rel="noopener noreferrer">
                  <span className="mr-2">🇨🇳</span> China Embassies & Consulates
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://overseas.mofa.go.kr/en/main/index.do" target="_blank" rel="noopener noreferrer">
                  <span className="mr-2">🇰🇷</span> South Korea Embassies & Consulates
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://www.thaiembassy.com/embassy/thai-embassy-worldwide" target="_blank" rel="noopener noreferrer">
                  <span className="mr-2">🇹🇭</span> Thailand Embassies & Consulates
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Visa Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500 mb-4">
              Professional visa application services to help with your travel documentation:
            </p>
            <div className="space-y-3">
              <Button className="w-full">
                Visa Application Assistance
              </Button>
              <Button variant="outline" className="w-full">
                Document Authentication
              </Button>
              <Button variant="secondary" className="w-full">
                Express Processing
              </Button>
            </div>
            
            <div className="mt-6 p-3 bg-neutral-50 rounded-md text-xs text-neutral-500 italic">
              Note: Additional fees apply for visa services. Processing times may vary based on destination country and your nationality.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Visas;