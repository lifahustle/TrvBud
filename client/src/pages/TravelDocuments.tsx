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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText,
  Upload,
  Download,
  Shield,
  Calendar,
  MapPin,
  User,
  Check,
  AlertTriangle,
  Clock,
  Plus,
  Eye,
  Trash2,
  Share2,
  Lock,
  Smartphone,
  Cloud,
  Camera,
  Scan
} from "lucide-react";

interface Document {
  id: string;
  type: 'passport' | 'visa' | 'id' | 'license' | 'insurance' | 'vaccination' | 'other';
  name: string;
  issueDate: Date;
  expiryDate: Date;
  issuingCountry: string;
  documentNumber: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  fileUrl?: string;
  notes?: string;
  reminderSet?: boolean;
  verificationStatus: 'verified' | 'pending' | 'failed';
}

interface TravelAlert {
  id: string;
  type: 'document_expiry' | 'visa_required' | 'vaccination_required' | 'document_missing';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  dueDate?: Date;
}

const TravelDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [alerts, setAlerts] = useState<TravelAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'alerts' | 'scan'>('documents');
  const [showAddDocument, setShowAddDocument] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Sample documents
  const sampleDocuments: Document[] = [
    {
      id: "1",
      type: "passport",
      name: "US Passport",
      issueDate: new Date(2020, 5, 15),
      expiryDate: new Date(2030, 5, 15),
      issuingCountry: "United States",
      documentNumber: "123456789",
      status: "valid",
      verificationStatus: "verified",
      reminderSet: true
    },
    {
      id: "2", 
      type: "visa",
      name: "Thailand Tourist Visa",
      issueDate: new Date(2024, 11, 1),
      expiryDate: new Date(2025, 5, 1),
      issuingCountry: "Thailand",
      documentNumber: "TH-2024-567890",
      status: "valid",
      verificationStatus: "verified",
      notes: "60-day tourist visa, single entry"
    },
    {
      id: "3",
      type: "insurance",
      name: "Travel Insurance",
      issueDate: new Date(2025, 0, 1),
      expiryDate: new Date(2025, 11, 31),
      issuingCountry: "United States",
      documentNumber: "INS-2025-001122",
      status: "valid",
      verificationStatus: "verified",
      notes: "Comprehensive coverage for Southeast Asia"
    },
    {
      id: "4",
      type: "license",
      name: "International Driving Permit",
      issueDate: new Date(2024, 8, 10),
      expiryDate: new Date(2025, 8, 10),
      issuingCountry: "United States",
      documentNumber: "IDP-2024-998877",
      status: "expiring",
      verificationStatus: "verified",
      notes: "Valid for car rentals in Southeast Asia"
    }
  ];

  // Sample alerts
  const sampleAlerts: TravelAlert[] = [
    {
      id: "1",
      type: "document_expiry",
      title: "International Driving Permit Expiring Soon",
      description: "Your IDP expires in 45 days. Renew before your next trip to ensure you can rent vehicles.",
      severity: "medium",
      actionRequired: true,
      dueDate: new Date(2025, 8, 10)
    },
    {
      id: "2",
      type: "visa_required",
      title: "Vietnam Visa Required",
      description: "Based on your upcoming trip to Vietnam, you need to apply for a tourist visa.",
      severity: "high",
      actionRequired: true
    },
    {
      id: "3",
      type: "vaccination_required",
      title: "Hepatitis A Vaccination Recommended",
      description: "Consider getting Hepatitis A vaccination for your Southeast Asia trip.",
      severity: "low",
      actionRequired: false
    }
  ];

  useEffect(() => {
    setDocuments(sampleDocuments);
    setAlerts(sampleAlerts);
  }, []);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport': return <FileText className="h-5 w-5" />;
      case 'visa': return <MapPin className="h-5 w-5" />;
      case 'license': return <User className="h-5 w-5" />;
      case 'insurance': return <Shield className="h-5 w-5" />;
      case 'vaccination': return <Check className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const validDocuments = documents.filter(d => d.status === 'valid').length;
  const expiringDocuments = documents.filter(d => d.status === 'expiring').length;
  const completionPercentage = (validDocuments / documents.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Travel Documents - TrvBUD V2</title>
        <meta name="description" content="Securely manage all your travel documents with smart reminders and verification." />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Travel Documents
        </h1>
        <p className="text-neutral-500">Securely store and manage all your travel documents</p>
      </div>

      {/* Document Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Valid Documents</p>
                <p className="text-2xl font-bold text-green-600">{validDocuments}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringDocuments}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Completion</p>
                <p className="text-2xl font-bold">{Math.round(completionPercentage)}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-8 w-fit">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'documents' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          My Documents
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scan' 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Scan Documents
        </button>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Document Library</h2>
            <Button onClick={() => setShowAddDocument(!showAddDocument)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>

          {/* Add Document Form */}
          {showAddDocument && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Document</CardTitle>
                <CardDescription>Upload and categorize your travel documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="license">Driver's License/IDP</SelectItem>
                        <SelectItem value="insurance">Travel Insurance</SelectItem>
                        <SelectItem value="vaccination">Vaccination Certificate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Name</label>
                    <Input placeholder="e.g., US Passport" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Number</label>
                    <Input placeholder="Document number or ID" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Issuing Country</label>
                    <Input placeholder="Country of issue" />
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center mb-4">
                  <Cloud className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">Drag and drop your document or</p>
                  <Button variant="outline" onClick={simulateUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  {isUploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-neutral-500 mt-2">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button>Save Document</Button>
                  <Button variant="outline" onClick={() => setShowAddDocument(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        {getDocumentIcon(document.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{document.name}</h3>
                        <p className="text-sm text-neutral-500">{document.documentNumber}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Issuing Country</span>
                      <span className="font-medium">{document.issuingCountry}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Issue Date</span>
                      <span className="font-medium">{document.issueDate.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">Expiry Date</span>
                      <div className="text-right">
                        <span className="font-medium">{document.expiryDate.toLocaleDateString()}</span>
                        <p className="text-xs text-neutral-400">
                          {getDaysUntilExpiry(document.expiryDate)} days remaining
                        </p>
                      </div>
                    </div>
                    
                    {document.verificationStatus === 'verified' && (
                      <div className="flex items-center text-sm text-green-600">
                        <Shield className="h-4 w-4 mr-2" />
                        Verified Document
                      </div>
                    )}
                    
                    {document.notes && (
                      <div className="bg-neutral-50 p-3 rounded-lg">
                        <p className="text-sm text-neutral-600">{document.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Travel Alerts & Reminders</h2>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} priority
                        </Badge>
                      </div>
                      
                      <p className="text-neutral-600 mb-3">{alert.description}</p>
                      
                      {alert.dueDate && (
                        <div className="flex items-center text-sm text-neutral-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          Due: {alert.dueDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {alert.actionRequired && (
                      <Button size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {alerts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">All Clear!</h3>
                  <p className="text-neutral-500">No alerts at this time. Your documents are in good shape.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Scan Documents Tab */}
      {activeTab === 'scan' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Document Scanner</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Camera Scan
                </CardTitle>
                <CardDescription>Use your device camera to scan documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
                  <Camera className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">Position your document in the camera view</p>
                  <Button>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scan className="h-5 w-5 mr-2" />
                  Smart Recognition
                </CardTitle>
                <CardDescription>Automatically extract document information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm">Passport Detection</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm">Text Extraction (OCR)</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm">Date Recognition</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm">Auto-Categorization</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  
                  <p className="text-sm text-neutral-500 mt-4">
                    Our AI will automatically detect document type, extract key information, 
                    and organize everything for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Lock className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-sm text-neutral-500">Your documents are encrypted at all times</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Secure Cloud Storage</p>
                    <p className="text-sm text-neutral-500">Backed up safely in encrypted cloud storage</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium">Offline Access</p>
                    <p className="text-sm text-neutral-500">Access your documents even without internet</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TravelDocuments;