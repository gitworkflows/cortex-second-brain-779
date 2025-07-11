import { Bot, Users, Bell, Settings, Zap, Network, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { Badge } from '@/components/ui/badge';

interface MultiThreadingSectionProps {
  show: boolean;
}

export const MultiThreadingSection = ({ show }: MultiThreadingSectionProps) => {
  const capabilities = [
    {
      icon: <Users size={20} />,
      title: "Multiple Agent Coordination",
      description: "Orchestrate multiple AI agents working on different tasks simultaneously",
      badge: "Core"
    },
    {
      icon: <Activity size={20} />,
      title: "Agent Status Monitoring",
      description: "Real-time visibility into each agent's progress and current operations",
      badge: "Native"
    },
    {
      icon: <Bell size={20} />,
      title: "Smart Notifications",
      description: "Context-aware alerts when agents complete tasks or need attention",
      badge: "Intelligent"
    },
    {
      icon: <Settings size={20} />,
      title: "Autonomy Controls",
      description: "Fine-grained settings for agent independence and decision-making",
      badge: "Advanced"
    }
  ];

  return (
    <AnimatedTransition show={show} animation="slide-up" duration={600}>
      <section className="mt-20 mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-1.5 bg-muted rounded-xl mb-4">
            <div className="bg-background px-4 py-2 rounded-lg shadow-sm">
              <Zap size={22} className="inline-block mr-2 text-primary" />
              <span className="font-semibold">Force Multiplier</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Multi-threading as a{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Force Multiplier
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto text-lg">
            Not only is the future agentic, it's one where developers are coordinating multiple agents at once. 
            We are investing in supporting this workflow natively in a way no other app has.
          </p>
        </div>

        {/* Main Visual */}
        <div className="relative mb-12">
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg">
                    <Network size={32} className="text-primary-foreground" />
                  </div>
                  {/* Animated dots representing multiple agents */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse delay-75">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse delay-150">
                    <Bot size={14} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Native Multi-Agent Orchestration</h3>
                <p className="text-muted-foreground">
                  The first platform built from the ground up for coordinating multiple AI agents seamlessly
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => (
            <Card key={index} className="border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {capability.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {capability.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  {capability.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-base">
                  {capability.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Zap size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Why Multi-Threading Matters</h4>
              <p className="text-muted-foreground leading-relaxed">
                While other platforms treat AI as a single conversation, we recognize that real productivity comes from 
                parallel processing. Our native support for multiple agent statuses, intelligent notifications, and 
                granular autonomy settings means you can scale your cognitive capabilities like never before.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedTransition>
  );
};