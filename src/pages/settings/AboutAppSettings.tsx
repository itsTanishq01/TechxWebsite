
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AboutAppSettings = () => {
  // App version
  const appVersion = "1.0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Application</CardTitle>
        <CardDescription>
          KhetSeva application information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-muted-foreground text-sm">Version</Label>
          <div className="font-medium">{appVersion}</div>
        </div>
        
        <div>
          <Label className="text-muted-foreground text-sm">Released</Label>
          <div className="font-medium">March 2025</div>
        </div>
        
        <div>
          <Label className="text-muted-foreground text-sm">Developer</Label>
          <div className="font-medium">KhetSeva Technologies</div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            KhetSeva is an intelligent agricultural assistant designed to help farmers maximize crop yields through AI-powered analysis and recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutAppSettings;
