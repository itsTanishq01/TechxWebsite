
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, Database, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

type YieldPredictionRecord = {
  id: string;
  crop_type: string;
  region: string;
  soil_ph: number;
  nitrogen: number;
  organic_matter: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  predicted_yield: number;
  confidence_score: number;
  created_at: string;
};

export function YieldPredictionHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<YieldPredictionRecord[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const fetchPredictions = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('yield_predictions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPredictions(data as YieldPredictionRecord[]);
    } catch (error: any) {
      console.error('Error fetching predictions:', error);
      toast({
        title: "Failed to load predictions",
        description: error.message || "An error occurred while loading your prediction history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [isAuthenticated, user]);

  const handleDelete = async (id: string) => {
    setSelectedPrediction(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPrediction) return;
    
    try {
      const { error } = await supabase
        .from('yield_predictions')
        .delete()
        .eq('id', selectedPrediction);
      
      if (error) throw error;
      
      setPredictions(predictions.filter(p => p.id !== selectedPrediction));
      toast({
        title: "Prediction deleted",
        description: "The prediction has been removed from your history",
      });
    } catch (error: any) {
      console.error('Error deleting prediction:', error);
      toast({
        title: "Failed to delete prediction",
        description: error.message || "An error occurred while deleting the prediction",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPrediction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Loading your prediction history...
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="py-8 text-center">
        <Database className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No prediction history yet</h3>
        <p className="text-muted-foreground">
          Your yield predictions will appear here once you've made some.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your prediction history</h2>
        <Button variant="outline" size="sm" onClick={fetchPredictions}>
          Refresh
        </Button>
      </div>
      
      <div className="space-y-3">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="capitalize text-lg">
                    {prediction.crop_type || "Unknown crop"}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                    {format(new Date(prediction.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(prediction.id)}
                    className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    title="Delete prediction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Yield</div>
                  <div className="font-semibold">{prediction.predicted_yield.toFixed(2)} tons/ha</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                  <div className="font-semibold">{(prediction.confidence_score * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Soil pH</div>
                  <div className="font-semibold">{prediction.soil_ph}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nitrogen</div>
                  <div className="font-semibold">{prediction.nitrogen} kg/ha</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="flex-1">
                  <span>Temperature: {prediction.temperature}°C</span>
                  <span className="mx-2">•</span>
                  <span>Humidity: {prediction.humidity}%</span>
                  <span className="mx-2">•</span>
                  <span>Rainfall: {prediction.rainfall}mm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this prediction from your history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
