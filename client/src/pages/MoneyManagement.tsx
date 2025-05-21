import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowRightLeft, 
  DollarSign, 
  BarChart3, 
  CreditCard, 
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MoneyManagement = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("JPY");
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Popular East Asian currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
    { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" }
  ];

  // Exchange rate data - simulated rates for East Asian currencies against USD
  const exchangeRates = {
    "USD": { "USD": 1.00, "JPY": 153.21, "KRW": 1379.52, "CNY": 7.23, "HKD": 7.82, "SGD": 1.35, "THB": 36.24, "MYR": 4.73, "IDR": 15952.40, "PHP": 56.82, "VND": 25135.00, "TWD": 32.42 },
    "JPY": { "USD": 0.00652, "JPY": 1.00, "KRW": 9.00, "CNY": 0.0472, "HKD": 0.0510, "SGD": 0.0088, "THB": 0.2366, "MYR": 0.0309, "IDR": 104.12, "PHP": 0.3709, "VND": 164.05, "TWD": 0.2116 },
    "KRW": { "USD": 0.00072, "JPY": 0.1111, "KRW": 1.00, "CNY": 0.00524, "HKD": 0.00567, "SGD": 0.00098, "THB": 0.02627, "MYR": 0.00343, "IDR": 11.56, "PHP": 0.04119, "VND": 18.22, "TWD": 0.02351 },
    "CNY": { "USD": 0.1384, "JPY": 21.19, "KRW": 190.80, "CNY": 1.00, "HKD": 1.082, "SGD": 0.1868, "THB": 5.013, "MYR": 0.6541, "IDR": 2206.42, "PHP": 7.8588, "VND": 3476.45, "TWD": 4.4841 },
    "HKD": { "USD": 0.1279, "JPY": 19.59, "KRW": 176.41, "CNY": 0.9242, "HKD": 1.00, "SGD": 0.1726, "THB": 4.6342, "MYR": 0.6048, "IDR": 2040.72, "PHP": 7.2660, "VND": 3214.19, "TWD": 4.1457 },
    "SGD": { "USD": 0.7407, "JPY": 113.49, "KRW": 1022.61, "CNY": 5.3533, "HKD": 5.7926, "SGD": 1.00, "THB": 26.8444, "MYR": 3.5037, "IDR": 11816.59, "PHP": 42.0889, "VND": 18618.52, "TWD": 24.0148 },
    "THB": { "USD": 0.0276, "JPY": 4.23, "KRW": 38.06, "CNY": 0.1994, "HKD": 0.2157, "SGD": 0.0372, "THB": 1.00, "MYR": 0.1305, "IDR": 440.19, "PHP": 1.5679, "VND": 693.57, "TWD": 0.8945 },
    "MYR": { "USD": 0.2114, "JPY": 32.39, "KRW": 291.65, "CNY": 1.5289, "HKD": 1.6535, "SGD": 0.2854, "THB": 7.6618, "MYR": 1.00, "IDR": 3372.39, "PHP": 12.0127, "VND": 5314.59, "TWD": 6.8542 },
    "IDR": { "USD": 0.0000627, "JPY": 0.0096, "KRW": 0.0865, "CNY": 0.0004533, "HKD": 0.0004901, "SGD": 0.0000846, "THB": 0.0022716, "MYR": 0.0002965, "IDR": 1.00, "PHP": 0.0035617, "VND": 1.5756, "TWD": 0.0020323 },
    "PHP": { "USD": 0.0176, "JPY": 2.697, "KRW": 24.29, "CNY": 0.1273, "HKD": 0.1376, "SGD": 0.0238, "THB": 0.6379, "MYR": 0.0833, "IDR": 280.75, "PHP": 1.00, "VND": 442.36, "TWD": 0.5706 },
    "VND": { "USD": 0.0000398, "JPY": 0.00609, "KRW": 0.0549, "CNY": 0.0002877, "HKD": 0.0003111, "SGD": 0.0000537, "THB": 0.001442, "MYR": 0.0001881, "IDR": 0.6347, "PHP": 0.00226, "VND": 1.00, "TWD": 0.00129 },
    "TWD": { "USD": 0.0308, "JPY": 4.724, "KRW": 42.55, "CNY": 0.2230, "HKD": 0.2413, "SGD": 0.0416, "THB": 1.1179, "MYR": 0.1459, "IDR": 492.06, "PHP": 1.7526, "VND": 775.29, "TWD": 1.00 }
  };

  // Handle currency conversion
  const handleConversion = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (fromCurrency && toCurrency && amount) {
        // Get conversion rate from our simulated data
        const fromRates = exchangeRates[fromCurrency as keyof typeof exchangeRates];
        const rate = fromRates[toCurrency as keyof typeof fromRates];
        setConversionRate(rate);
        
        // Calculate converted amount
        const amountNum = parseFloat(amount);
        if (!isNaN(amountNum)) {
          setConvertedAmount(amountNum * rate);
        }
        
        // Set last updated timestamp
        const now = new Date();
        setLastUpdated(now.toLocaleString());
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Swap currencies
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Handle conversion on initial load and when currencies change
  useEffect(() => {
    handleConversion();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Wallet - Trv Bud</title>
        <meta name="description" content="Manage your travel money with currency exchange, budgeting tools, and expense tracking." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wallet</h1>
      <p className="text-neutral-500 mb-8">Exchange currencies, track expenses, and manage your travel budget</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <img src="https://wise.com/public-resources/assets/logos/wise/brand-logo.svg" alt="Wise" className="h-6 mr-2" />
                    Currency Exchange
                  </CardTitle>
                  <CardDescription>Convert between currencies with real-time rates</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-0">
                  Powered by Wise
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">From</label>
                  <div className="flex space-x-3">
                    <div className="w-2/3">
                      <Input 
                        type="text" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg font-medium"
                      />
                    </div>
                    <div className="w-1/3">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center">
                                <span className="mr-2">{currency.code}</span>
                                <span className="text-neutral-400 text-xs">({currency.symbol})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSwapCurrencies}
                    className="rounded-full"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">To</label>
                  <div className="flex space-x-3">
                    <div className="w-2/3">
                      <Input 
                        type="text" 
                        value={convertedAmount !== null ? convertedAmount.toFixed(2) : ''}
                        readOnly
                        className="text-lg font-medium bg-neutral-50"
                      />
                    </div>
                    <div className="w-1/3">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center">
                                <span className="mr-2">{currency.code}</span>
                                <span className="text-neutral-400 text-xs">({currency.symbol})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Button 
                    onClick={handleConversion}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Convert
                  </Button>
                  {conversionRate && (
                    <div className="text-sm text-neutral-500">
                      1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
                    </div>
                  )}
                </div>
              </div>
              
              {lastUpdated && (
                <div className="mt-6 text-xs text-neutral-400">
                  Last updated: {lastUpdated}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Send Money Abroad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-4">Transfer money internationally with low fees and excellent exchange rates.</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Up to 8x cheaper than banks</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Fast transfers to 80+ countries</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Transparent fees, no hidden costs</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Start a Transfer</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-secondary" />
                  Multi-Currency Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 mb-4">Hold and spend multiple currencies with one travel-friendly card.</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm">Hold 40+ currencies</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm">Spend abroad with no hidden fees</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-secondary mr-2" />
                    <span className="text-sm">Accepted worldwide</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full mt-4">Get a Card</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                Exchange Rate Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Popular East Asian Currencies</h3>
              
              <div className="space-y-4">
                {/* JPY/USD */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Japanese Yen (JPY)</span>
                    <span className="text-sm text-neutral-500">¥153.21 = $1</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-green-500">+1.2% this week</span>
                    <span className="text-xs text-neutral-400">Strong against USD</span>
                  </div>
                </div>
                
                {/* KRW/USD */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Korean Won (KRW)</span>
                    <span className="text-sm text-neutral-500">₩1379.52 = $1</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-red-500">-0.8% this week</span>
                    <span className="text-xs text-neutral-400">Weakening slightly</span>
                  </div>
                </div>
                
                {/* CNY/USD */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Chinese Yuan (CNY)</span>
                    <span className="text-sm text-neutral-500">¥7.23 = $1</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-amber-500">Stable this week</span>
                    <span className="text-xs text-neutral-400">Closely managed rate</span>
                  </div>
                </div>
                
                {/* SGD/USD */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Singapore Dollar (SGD)</span>
                    <span className="text-sm text-neutral-500">S$1.35 = $1</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-green-500">+1.5% this week</span>
                    <span className="text-xs text-neutral-400">Strong performance</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Travel Tip:</h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      The Japanese Yen (JPY) has favorable exchange rates right now - consider exchanging currency for your Japan trip soon.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoneyManagement;