
import React from 'react';

export function ColorShowcase() {
  const colorGroups = [
    {
      title: "Primary Colors",
      colors: [
        { name: "Primary", variable: "bg-primary text-primary-foreground", className: "bg-primary text-primary-foreground" },
        { name: "Secondary", variable: "bg-secondary text-secondary-foreground", className: "bg-secondary text-secondary-foreground" },
        { name: "Tertiary", variable: "bg-tertiary text-tertiary-foreground", className: "bg-tertiary text-tertiary-foreground" },
      ]
    },
    {
      title: "UI Colors",
      colors: [
        { name: "Background", variable: "bg-background text-foreground", className: "bg-background text-foreground" },
        { name: "Card", variable: "bg-card text-card-foreground", className: "bg-card text-card-foreground" },
        { name: "Muted", variable: "bg-muted text-muted-foreground", className: "bg-muted text-muted-foreground" },
        { name: "Accent", variable: "bg-accent text-accent-foreground", className: "bg-accent text-accent-foreground" },
      ]
    },
    {
      title: "Chart Colors",
      colors: [
        { name: "Chart 1", variable: "--chart-1", className: "bg-[color:var(--chart-1)] text-white" },
        { name: "Chart 2", variable: "--chart-2", className: "bg-[color:var(--chart-2)] text-black" },
        { name: "Chart 3", variable: "--chart-3", className: "bg-[color:var(--chart-3)] text-white" },
        { name: "Chart 4", variable: "--chart-4", className: "bg-[color:var(--chart-4)] text-white" },
        { name: "Chart 5", variable: "--chart-5", className: "bg-[color:var(--chart-5)] text-white" },
      ]
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">VenturesRoom Color System</h2>
      
      {colorGroups.map((group, i) => (
        <div key={i} className="space-y-4">
          <h3 className="text-xl font-semibold">{group.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.colors.map((color, j) => (
              <div 
                key={j} 
                className={`p-6 rounded-lg shadow-md ${color.className}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{color.name}</span>
                  <code className="text-xs opacity-70">{color.variable}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 space-y-4">
        <h3 className="text-xl font-semibold">Component Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-md">
            <h4 className="font-medium mb-2">Card Component</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This is how a card component looks with the current theme.
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
              Primary Button
            </button>
          </div>
          
          <div className="bg-accent p-6 rounded-lg">
            <h4 className="font-medium mb-2">Accent Section</h4>
            <p className="text-sm text-accent-foreground mb-4">
              Content with accent background for highlighting.
            </p>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium">
              Secondary Button
            </button>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h4 className="font-medium mb-2">Muted Section</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Less prominent content uses muted colors.
            </p>
            <button className="bg-tertiary text-tertiary-foreground px-4 py-2 rounded-md text-sm font-medium">
              Tertiary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
