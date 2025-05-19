import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Train, Clock, MapPin, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Fast, Reliable Train Scheduling
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Find train schedules effortlessly with our intuitive platform.
              Enjoy real-time updates and seamless travel planning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule" className="cursor-pointer">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 cursor-pointer"
                >
                  View Schedule <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="cursor-pointer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white hover:bg-gray-800 hover:text-white text-black cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4">
                <Train />
              </div>
              <h3 className="text-xl font-semibold mb-2">Extensive Coverage</h3>
              <p className="text-muted-foreground">
                Access schedules for all major train routes nationwide.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4">
                <Clock />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Stay informed with live departure and arrival information.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4">
                <MapPin />
              </div>
              <h3 className="text-xl font-semibold mb-2">Station Details</h3>
              <p className="text-muted-foreground">
                Get comprehensive information about stations and facilities.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-4">
                <Shield />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Service</h3>
              <p className="text-muted-foreground">
                Trust our platform for accurate and up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Create an account today to access personalized train schedules and
            receive real-time updates.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="cursor-pointer">
              <Button size="lg" className="cursor-pointer">
                Register Now
              </Button>
            </Link>
            <Link href="/schedule" className="cursor-pointer">
              <Button size="lg" variant="outline" className="cursor-pointer">
                Browse Schedules
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">
                    Frequent Traveler
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                &ldquo;This scheduling app has completely transformed my
                commuting experience. The real-time updates have saved me
                countless hours.&rdquo;
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  SM
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <p className="text-sm text-muted-foreground">
                    Business Traveler
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                &ldquo;The interface is intuitive and the information is always
                accurate. I can depend on this service for my business
                trips.&rdquo;
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">
                  RP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Parker</h4>
                  <p className="text-sm text-muted-foreground">Tourist</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                &ldquo;As a tourist, I found this app incredibly helpful for
                navigating the train system in an unfamiliar city. Highly
                recommended!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
