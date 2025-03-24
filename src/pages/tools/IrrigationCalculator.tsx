
import React from 'react';
import IrrigationCalculator from '@/components/tools/IrrigationCalculator';

const IrrigationCalculatorPage = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Irrigation Water Calculator</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Calculate the optimal irrigation water requirement for different crops based on growth stage and field area
          </p>
        </div>
        
        <IrrigationCalculator />
        
        <div className="mt-12 max-w-3xl mx-auto bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">About Irrigation Water Requirements</h2>
          <p className="mb-4">
            Proper irrigation is essential for optimal crop growth and yield. Water requirements vary significantly based on:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Crop Type:</strong> Different crops have different water needs throughout their lifecycle.</li>
            <li><strong>Growth Stage:</strong> Water requirements change as plants progress from seeding to maturity.</li>
            <li><strong>Field Size:</strong> Larger areas naturally require more water for adequate coverage.</li>
            <li><strong>Climate Conditions:</strong> Temperature, rainfall, and humidity affect irrigation needs.</li>
          </ul>
          <p>
            This calculator provides estimates based on standard irrigation recommendations. For best results, 
            consider consulting with local agricultural extension services for region-specific advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IrrigationCalculatorPage;
