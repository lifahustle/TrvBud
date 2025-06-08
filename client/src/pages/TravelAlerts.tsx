import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, MapPin, Plane, Info, ExternalLink, Filter, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface TravelAlert {
  id: string;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "flight" | "weather" | "security" | "health" | "transport" | "general";
  countries: string[];
  affectedAirports?: string[];
  publishedAt: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
}

const severityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200"
};

const categoryIcons = {
  flight: Plane,
  weather: AlertTriangle,
  security: AlertTriangle,
  health: Info,
  transport: MapPin,
  general: Info
};

const seaCountries = [
  "Thailand", "Vietnam", "Singapore", "Malaysia", "Philippines", 
  "Indonesia", "Cambodia", "Laos", "Myanmar", "Brunei"
];

export default function TravelAlerts() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const { data: alerts = [], isLoading, error, refetch } = useQuery({
    queryKey: ["/api/travel-alerts", selectedCountry, selectedCategory, selectedSeverity],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const filteredAlerts = alerts.filter((alert: TravelAlert) => {
    const countryMatch = selectedCountry === "all" || alert.countries.includes(selectedCountry);
    const categoryMatch = selectedCategory === "all" || alert.category === selectedCategory;
    const severityMatch = selectedSeverity === "all" || alert.severity === selectedSeverity;
    return countryMatch && categoryMatch && severityMatch;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Travel Alerts - TrvBUD</title>
        <meta name="description" content="Real-time travel alerts and updates for Southeast Asian destinations. Stay informed about flight delays, weather conditions, and travel advisories." />
      </Helmet>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Travel Alerts
            </h1>
            <p className="text-neutral-600 mt-2">
              Real-time updates on travel disruptions across Southeast Asia
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[160px]">
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {seaCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[160px]">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="flight">Flight Delays</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[160px]">
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Display */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Travel Alerts</h3>
            <p className="text-red-600 mb-4">
              We're having trouble fetching the latest travel updates. Please check your connection and try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredAlerts.length === 0 ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <Info className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">No Active Alerts</h3>
            <p className="text-green-600">
              Great news! There are currently no travel alerts matching your filters for Southeast Asian destinations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert: TravelAlert) => {
            const IconComponent = categoryIcons[alert.category];
            
            return (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${severityColors[alert.severity]}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{alert.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <IconComponent className="h-3 w-3 mr-1" />
                            {alert.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${severityColors[alert.severity]}`}
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(alert.publishedAt)}
                      </div>
                    </div>
                  </div>

                  <p className="text-neutral-700 mb-4 leading-relaxed">{alert.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        {alert.countries.join(", ")}
                      </span>
                    </div>
                    {alert.affectedAirports && alert.affectedAirports.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Plane className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm text-neutral-600">
                          {alert.affectedAirports.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-neutral-500">
                      Source: {alert.source} • Updated: {formatDate(alert.lastUpdated)}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        Read More <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}