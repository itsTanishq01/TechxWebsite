
import { Award, Leaf, Users, Github, Linkedin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Team member data with updated social media links
const teamMembers = [
  {
    name: "Tanishq Nimje",
    role: "Full Stack Developer",
    image: "test.png",
    github: "https://github.com/itsTanishq01",
    linkedin: "https://www.linkedin.com/in/tanishqnimje/",
    instagram: "https://www.instagram.com/tanishqnimje"
  },
  {
    name: "Rahul Lenka",
    role: "Backend Developer",
    image: "test.png",
    github: "https://github.com/rxhul08",
    linkedin: "https://www.linkedin.com/in/rahul-lenka-3b7018238/",
    instagram: "https://www.instagram.com/rahullllll.8/"
  },
  {
    name: "Pranav Kumar",
    role: "ML Engineer",
    image: "test.png",
    github: "https://github.com/GitPranav04",
    linkedin: "https://www.linkedin.com/in/pranav-kumar-410a70251/",
    instagram: "https://www.instagram.com/prranav.19/"
  },
  {
    name: "Aryan Behera",
    role: "Frontend Developer",
    image: "test.png",
    github: "https://github.com/behera28",
    linkedin: "https://www.linkedin.com/in/behera28/",
    instagram: "https://www.instagram.com/aryan.dumb/"
  },
  {
    name: "Akash Prasad",
    role: "UI/UX Designer",
    image: "test.png",
    github: "https://github.com/Ak-pd32",
    linkedin: "https://www.linkedin.com/in/akashprasad-ap/",
    instagram: "https://www.instagram.com/prasadakash112/"
  },
  {
    name: "Atulya Bihari Singh",
    role: "DevOps Engineer",
    image: "test.png",
    github: "https://github.com/Atulya048",
    linkedin: "https://www.linkedin.com/in/atulya-bihari-singh-0b3398248/",
    instagram: "https://www.instagram.com/atulyaa.04/"
  }
];

const AboutUs = () => {
  return (
    <div>
      <ScrollArea className="h-full scrollbar-none">
        <div className="bg-background text-foreground min-h-screen py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">About KhetSeva</h1>
              <p className="text-lg text-muted-foreground">
                Revolutionizing agriculture through technology and innovation
              </p>
            </div>
            
            {/* Mission */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="bg-muted p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  At KhetSeva, we're dedicated to transforming traditional farming through innovative 
                  technology solutions. Our mission is to empower farmers with accessible, AI-driven 
                  tools that enhance productivity, sustainability, and profitability.
                </p>
              </div>
            </div>
            
            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <Card className="bg-card border-border rounded-xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sustainable Farming</h3>
                  <p className="text-muted-foreground">
                    Our technologies promote sustainable agricultural practices, 
                    reducing waste and environmental impact.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border rounded-xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cutting-Edge Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously develop and improve our AI solutions to address 
                    evolving agricultural challenges.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border rounded-xl">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Farmer-Focused</h3>
                  <p className="text-muted-foreground">
                    Our solutions are designed with real farmers' needs in mind, making 
                    advanced technology accessible to all.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Team */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-card border-border rounded-xl">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://via.placeholder.com/150';
                          }} 
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-muted-foreground mb-4">{member.role}</p>
                      <div className="flex space-x-3">
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Github size={20} />
                        </a>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Linkedin size={20} />
                        </a>
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Instagram size={20} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AboutUs;
