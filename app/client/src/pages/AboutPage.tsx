import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, FileText, Users, MessageSquare, Download } from 'lucide-react';

// Developer profiles
const developers = [
  {
    name: 'Alex Johnson',
    role: 'Full Stack Developer',
    bio: 'Experienced developer with expertise in React, Node.js, and cloud solutions. Passionate about creating intuitive user experiences.',
    image: 'https://i.pravatar.cc/300?img=1',
  },
  {
    name: 'Sarah Chen',
    role: 'AI Specialist',
    bio: 'Machine learning engineer focusing on natural language processing. Advocate for responsible AI development.',
    image: 'https://i.pravatar.cc/300?img=2',
  },
  {
    name: 'Michael Rodriguez',
    role: 'UX/UI Designer',
    bio: 'Designer with a background in user research and psychology. Creates interfaces that are both beautiful and functional.',
    image: 'https://i.pravatar.cc/300?img=3',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h1 className="text-4xl font-bold mb-4">Understand Your Content Through Multiple Perspectives</h1>
          <p className="text-lg text-muted-foreground mb-8">
            PersonaVerse helps you gain valuable insights into how diverse audiences perceive your content,
            helping you create more effective communication.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth/signup">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Upload Your Document</h3>
                    <p className="text-muted-foreground">
                      Start by uploading your document (.txt, .doc, .pdf, or .xlsx). Our system will process and prepare it for analysis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Select Personas</h3>
                    <p className="text-muted-foreground">
                      Choose from our diverse selection of personas representing different demographics, roles, and perspectives.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Define Expectations</h3>
                    <p className="text-muted-foreground">
                      Specify what you want to learn from each persona's feedback, like ratings, yes/no answers, or detailed responses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">4. Get Results</h3>
                    <p className="text-muted-foreground">
                      Receive comprehensive feedback in an easy-to-understand format, helping you gain insights and improve your content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{dev.name}</h3>
                  <p className="text-sm text-primary mb-3">{dev.role}</p>
                  <p className="text-sm text-muted-foreground">{dev.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-muted rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who are improving their content with multi-perspective feedback.
          </p>
          <Button asChild size="lg">
            <Link to="/auth/signup">
              Create Free Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
