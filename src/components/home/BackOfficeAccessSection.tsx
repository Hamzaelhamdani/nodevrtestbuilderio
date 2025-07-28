
import { BackOfficeAccessGuide } from "../utils/BackOfficeAccessGuide";

export function BackOfficeAccessSection() {
  return (
    <section className="py-12 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="mb-3">Back Office Access</h2>
          <p className="max-w-2xl mx-auto">
            Access your personalized back office dashboard based on your role. Manage products, 
            verify startups, track performance, or configure community discounts.
          </p>
        </div>
        
        <BackOfficeAccessGuide />
      </div>
    </section>
  );
}
