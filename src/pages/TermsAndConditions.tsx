
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
          <CardDescription>
            Please read these terms and conditions carefully before using FarmAI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to FarmAI, an AI-powered agricultural assistant designed to help farmers 
              optimize their crop yields through data analysis and recommendations. By accessing 
              or using our service, you agree to be bound by these Terms and Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Definitions</h2>
            <p className="text-muted-foreground">
              "Service" refers to the FarmAI application, website, and all content and services 
              provided by FarmAI.
              "User", "You", and "Your" refers to the individual or entity using our Service.
              "We", "Us", and "Our" refers to FarmAI Technologies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Data Usage</h2>
            <p className="text-muted-foreground">
              FarmAI collects soil data, environmental parameters, and user inputs to provide 
              agricultural recommendations. This data is processed using our proprietary AI 
              models to generate insights and suggestions. By using our Service, you grant us 
              permission to collect and process this data in accordance with our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Limitations of Liability</h2>
            <p className="text-muted-foreground">
              While we strive to provide accurate and reliable recommendations, FarmAI does not 
              guarantee specific results or outcomes. Agricultural success depends on many factors 
              beyond our control, including but not limited to weather conditions, implementation 
              of recommendations, and local environmental factors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users are responsible for the accuracy of the data they provide, implementing 
              recommendations at their own discretion, and complying with local agricultural 
              regulations and practices.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Account Security</h2>
            <p className="text-muted-foreground">
              Users are responsible for maintaining the confidentiality of their account 
              credentials and for all activities that occur under their account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">7. Modifications to the Service</h2>
            <p className="text-muted-foreground">
              FarmAI reserves the right to modify or discontinue, temporarily or permanently, 
              the Service with or without notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              FarmAI reserves the right to update these Terms and Conditions at any time. 
              We will notify users of any significant changes via email or through the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">9. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms and Conditions, please contact us at support@farmai.com.
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Last updated: October 2023
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
