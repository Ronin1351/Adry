'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Clock,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';

interface SubscriptionFlowM3Props {
  onSubscribe: (provider: 'STRIPE' | 'PAYPAL' | 'GCASH') => Promise<void>;
  isLoading?: boolean;
  currentSubscription?: {
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'PAST_DUE' | 'TRIAL';
    expiresAt: Date;
  };
}

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 600,
    period: '3 months',
    description: 'Access to message employees and schedule interviews',
    features: [
      'Unlimited employee browsing',
      'Start conversations with employees',
      'Schedule interviews',
      'View employee contact information',
      'Access to employee documents',
      'Priority customer support',
    ],
    popular: true,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'STRIPE',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'PAYPAL',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: '🅿️',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    id: 'GCASH',
    name: 'GCash',
    description: 'Philippine mobile payment',
    icon: '📱',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

export function SubscriptionFlowM3({ 
  onSubscribe, 
  isLoading = false,
  currentSubscription 
}: SubscriptionFlowM3Props) {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!selectedPaymentMethod) return;
    await onSubscribe(selectedPaymentMethod as 'STRIPE' | 'PAYPAL' | 'GCASH');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSubscriptionStatus = () => {
    if (!currentSubscription) return null;
    
    switch (currentSubscription.status) {
      case 'ACTIVE':
        return {
          text: 'Active',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'TRIAL':
        return {
          text: 'Trial',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'EXPIRED':
        return {
          text: 'Expired',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'CANCELED':
        return {
          text: 'Canceled',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
      case 'PAST_DUE':
        return {
          text: 'Past Due',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      default:
        return null;
    }
  };

  const status = getSubscriptionStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Subscription</h3>
                <p className="text-sm text-gray-600">
                  {status && (
                    <Badge className={`${status.color} ${status.bgColor} ${status.borderColor}`}>
                      {status.text}
                    </Badge>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium">
                  {new Date(currentSubscription.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Choose Your Plan</h2>
          <p className="text-gray-600 mt-2">
            Unlock the full potential of our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-center">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-center text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => setSelectedPlan(plan.id)}
                  variant={selectedPlan === plan.id ? 'default' : 'outline'}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
          <p className="text-sm text-gray-600">
            Select your preferred payment method
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedPaymentMethod === method.id 
                    ? `${method.bgColor} ${method.borderColor} border-2` 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h3 className={`font-medium ${selectedPaymentMethod === method.id ? method.color : 'text-gray-900'}`}>
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Trust */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium">Secure Payment</h3>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure. We use industry-standard security measures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>What You Get</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Browse and search employee profiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Start conversations with employees
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Schedule interviews
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Access contact information
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Platform Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Verified employee profiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Document verification
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Customer support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Regular platform updates
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribe Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleSubscribe}
          disabled={!selectedPaymentMethod || isLoading}
          className="px-8 py-3"
        >
          {isLoading ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Subscribe Now - {formatCurrency(600)} for 3 months
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          Cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Terms and Conditions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Your subscription will automatically renew unless canceled.
        </AlertDescription>
      </Alert>
    </div>
  );
}
