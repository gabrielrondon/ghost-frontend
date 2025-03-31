
import Header from "@/components/Header";
import { Ghost } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 text-white">
      <Header title="Ghost - About" />
      <div className="container py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <Ghost className="h-24 w-24 text-purple-400 mb-6" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent mb-4">
            The Ghost Project
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Zero-Knowledge Proofs as a Service, Enhanced by AI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-300">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Ghost is the first step in creating a Zero-Knowledge canister that will act as a privacy-preserving service for the Internet Computer and beyond. We're building a bridge between privacy technology and everyday applications.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-300">AI + ZK Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                By intersecting Zero-Knowledge proofs with artificial intelligence, Ghost will help manage and automate multiple use cases where privacy is essential. Our AI-enhanced proof system will make complex cryptography accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-300">Open Source</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Ghost is an open-source project committed to transparency and community collaboration. We believe that privacy-preserving technology should be accessible to all and developed with community input and oversight.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm mb-12">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Our Roadmap</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium text-white mb-2">Milestone 1: MVP - Core Proof System</h3>
            <ul className="list-disc pl-6 space-y-2 text-white/80">
              <li>Deploy a canister-based ZK proof system for private attestations</li>
              <li>Develop a simple frontend for proof requests</li>
              <li>Implement anonymous reference generation for proof verification</li>
              <li>Test execution with initial use cases</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white mb-2">Milestone 2: AI-Enhanced Proofs & Verification</h3>
            <ul className="list-disc pl-6 space-y-2 text-white/80">
              <li>Implement AI-based proof summarization</li>
              <li>Develop an enhanced proof verification interface</li>
              <li>Release an open-source implementation and documentation</li>
              <li>Create a repository of future use cases based on community feedback</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Join Our Community</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            We're building a community of developers, privacy advocates, and users who believe in the power of Zero-Knowledge technology. Whether you're a cryptographer, developer, or just interested in privacy, we welcome your contributions and ideas.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/ZKNotary/ghost" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
