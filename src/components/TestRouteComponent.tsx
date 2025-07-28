import { Route } from "./layout/NavigationBar";

interface TestRouteComponentProps {
  currentRoute: Route;
}

export function TestRouteComponent({ currentRoute }: TestRouteComponentProps) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Current Route: {currentRoute}</h1>
      <p>This is a test component to verify routing is working correctly</p>
    </div>
  );
}