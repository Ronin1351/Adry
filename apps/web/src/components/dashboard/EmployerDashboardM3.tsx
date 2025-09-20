'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  CreditCard, 
  Download, 
  Calendar,
  Users,
  MessageSquare,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { EmployerProfileFormM3 } from '@/components/forms/EmployerProfileFormM3';
import { SubscriptionFlowM3 } from '@/components/subscription/SubscriptionFlowM3';
import { getSubscriptionStatus, getPaywallData } from '@/lib/middleware/paywall-m3';
import { type EmployerProfile, type BillingHistory, type Subscription } from '@/lib/validations/employer-profile-m3';

interface EmployerDashboardM3Props {
  profile?: EmployerProfile;
  subscription?: Subscription;
  billingHistory?: BillingHistory[];
  onProfileUpdate: (data: Partial<EmployerProfile>) => Promise<void>;
  onSubscribe: (provider: 'STRIPE' | 'PAYPAL' | 'GCASH') => Promise<void>;
  onRenewSubscription: () => Promise<void>;
  onCancelSubscription: () => Promise<void>;
  isLoading?: boolean;
}

export function EmployerDashboardM3({
  profile,
  subscription,
  billingHistory = [],
  onProfileUpdate,
  onSubscribe,
  onRenewSubscription,
  onCancelSubscription,
  isLoading = false,
}: EmployerDashboardM3Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (profile?.userId) {
      getSubscriptionStatus(profile.userId).then(setSubscriptionStatus);
    }
  }, [profile?.userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'TRIAL':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'EXPIRED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'CANCELED':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'PAST_DUE':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'TRIAL':
        return <Clock className="h-4 w-4" />;
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4" />;
      case 'CANCELED':
        return <AlertCircle className="h-4 w-4" />;
      case 'PAST_DUE':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const paywallData = getPaywallData(subscriptionStatus);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your profile, subscription, and billing</p>
        </div>
        {paywallData && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{paywallData.icon}</span>
                <div>
                  <h3 className="font-medium text-orange-900">{paywallData.title}</h3>
                  <p className="text-sm text-orange-800">{paywallData.message}</p>
                </div>
                <Button 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => window.location.href = paywallData.actionUrl}
                >
                  {paywallData.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Score</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Complete your profile to attract more candidates
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Expires: {formatDate(subscription.expiresAt)}
                    </p>
                    {subscription.trialEndsAt && (
                      <p className="text-xs text-blue-600">
                        Trial ends: {formatDate(subscription.trialEndsAt)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">No active subscription</p>
                    <Button size="sm" onClick={() => setActiveTab('subscription')}>
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Chats</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scheduled Interviews</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shortlisted</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm">New message from Maria Santos</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm">Interview scheduled with Juan Dela Cruz</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm">Added Ana Garcia to shortlist</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <EmployerProfileFormM3
            initialData={profile}
            onSubmit={onProfileUpdate}
            onSaveDraft={onProfileUpdate}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {subscription ? (
            <div className="space-y-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Basic Plan</h3>
                        <p className="text-sm text-gray-600">₱600 every 3 months</p>
                      </div>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-medium">{subscription.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expires</p>
                        <p className="font-medium">{formatDate(subscription.expiresAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onRenewSubscription}
                      >
                        Renew
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onCancelSubscription}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Subscription Includes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Communication</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Unlimited employee browsing</li>
                        <li>• Start conversations with employees</li>
                        <li>• View contact information</li>
                        <li>• Access to employee documents</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Scheduling</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Schedule interviews</li>
                        <li>• Manage interview calendar</li>
                        <li>• Send interview reminders</li>
                        <li>• Track interview status</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <SubscriptionFlowM3
              onSubscribe={onSubscribe}
              isLoading={isLoading}
            />
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {billingHistory.length > 0 ? (
                <div className="space-y-4">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{formatCurrency(bill.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(bill.createdAt)} • {bill.provider}
                          </p>
                        </div>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {bill.invoiceUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(bill.invoiceUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No billing history yet</p>
                  <p className="text-sm text-gray-500">
                    Your billing history will appear here once you subscribe
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
