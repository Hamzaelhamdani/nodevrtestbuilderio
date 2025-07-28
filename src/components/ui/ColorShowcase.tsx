import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

export function ColorShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">VenturesRoom Color Palette</h2>
        <p className="text-muted-foreground mb-6">
          Our design system uses a cohesive color palette that adapts between light and dark modes while maintaining brand identity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>Main brand colors used throughout the interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-primary"></div>
                <div>
                  <p className="font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">var(--primary)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-secondary"></div>
                <div>
                  <p className="font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">var(--secondary)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-tertiary"></div>
                <div>
                  <p className="font-medium">Tertiary</p>
                  <p className="text-xs text-muted-foreground">var(--tertiary)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UI Colors</CardTitle>
            <CardDescription>Colors used for interface elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-background border border-border"></div>
                <div>
                  <p className="font-medium">Background</p>
                  <p className="text-xs text-muted-foreground">var(--background)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-card border border-border"></div>
                <div>
                  <p className="font-medium">Card</p>
                  <p className="text-xs text-muted-foreground">var(--card)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-muted"></div>
                <div>
                  <p className="font-medium">Muted</p>
                  <p className="text-xs text-muted-foreground">var(--muted)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Colors</CardTitle>
            <CardDescription>Colors used for text and typography</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-foreground"></div>
                <div>
                  <p className="font-medium">Foreground</p>
                  <p className="text-xs text-muted-foreground">var(--foreground)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-muted-foreground"></div>
                <div>
                  <p className="font-medium">Muted Foreground</p>
                  <p className="text-xs text-muted-foreground">var(--muted-foreground)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-accent-foreground"></div>
                <div>
                  <p className="font-medium">Accent Foreground</p>
                  <p className="text-xs text-muted-foreground">var(--accent-foreground)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Colors</CardTitle>
            <CardDescription>Colors indicating different states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-destructive"></div>
                <div>
                  <p className="font-medium">Destructive</p>
                  <p className="text-xs text-muted-foreground">var(--destructive)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-success"></div>
                <div>
                  <p className="font-medium">Success</p>
                  <p className="text-xs text-muted-foreground">var(--success)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-warning"></div>
                <div>
                  <p className="font-medium">Warning</p>
                  <p className="text-xs text-muted-foreground">var(--warning)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chart Colors</CardTitle>
            <CardDescription>Colors used for data visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-md bg-chart-1 mx-auto"></div>
                <p className="text-xs mt-2">Chart 1</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-md bg-chart-2 mx-auto"></div>
                <p className="text-xs mt-2">Chart 2</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-md bg-chart-3 mx-auto"></div>
                <p className="text-xs mt-2">Chart 3</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-md bg-chart-4 mx-auto"></div>
                <p className="text-xs mt-2">Chart 4</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-md bg-chart-5 mx-auto"></div>
                <p className="text-xs mt-2">Chart 5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="text-xl font-bold mb-4">Mode Comparison</h3>
        <p className="mb-4">Toggle between light and dark mode to see how our colors adapt while maintaining brand consistency.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium mb-2">Light Mode Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Soft green-white background (#f9faf7)</li>
              <li>Dark green-gray text (#1a2e23)</li>
              <li>Medium green primary (#4caf50)</li>
              <li>Lighter green secondary (#66bb6a)</li>
              <li>Subtle shadows and hover effects</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Dark Mode Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Dark navy background (#080f17)</li>
              <li>Light gray text (#d6dde6)</li>
              <li>Lime green primary (#c1f17e)</li>
              <li>Secondary lime variation (#a7ee43)</li>
              <li>Subtle glow effects on interactive elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}