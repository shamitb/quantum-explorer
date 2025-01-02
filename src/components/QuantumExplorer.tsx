"use client";

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Atom, Brain, Bot, FlaskRound, Zap } from 'lucide-react';

// Type definitions
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DialogContent {
  title: string;
  description: string;
}

interface GroqResponse {
  role: 'assistant';
  content: string;
}

// Simulated Groq API client
const groqClient = {
  async chat(messages: Message[]): Promise<GroqResponse> {
    const lastMessage = messages[messages.length - 1].content;
    
    if (lastMessage.includes('quantum')) {
      return {
        role: 'assistant',
        content: 'The quantum state you have created shows interesting properties. Consider how particle entanglement might affect your next move.'
      };
    }
    if (lastMessage.includes('experiment')) {
      return {
        role: 'assistant',
        content: 'Your experiment results indicate a coherent quantum field. You might want to stabilize it using the containment matrix.'
      };
    }
    return {
      role: 'assistant',
      content: 'Interesting approach. What quantum principles are you applying here?'
    };
  }
};

// Game constants
const INITIAL_ENERGY = 100;
const INITIAL_STABILITY = 75;
const INITIAL_COHERENCE = 50;

const QUANTUM_STATES = {
  STABLE: 'stable',
  UNSTABLE: 'unstable',
  CRITICAL: 'critical',
  SUPERPOSITION: 'superposition'
} as const;

type QuantumState = typeof QUANTUM_STATES[keyof typeof QUANTUM_STATES];

const QuantumExplorer: React.FC = () => {
  // Game state
  const [energy, setEnergy] = useState(INITIAL_ENERGY);
  const [stability, setStability] = useState(INITIAL_STABILITY);
  const [coherence, setCoherence] = useState(INITIAL_COHERENCE);
  const [currentState, setCurrentState] = useState<QuantumState>(QUANTUM_STATES.STABLE);
  const [score, setScore] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent>({ title: '', description: '' });
  const [gameOver, setGameOver] = useState(false);

  // AI Agent state
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Effects
  useEffect(() => {
    checkGameState();
  }, [energy, stability, coherence]);

  // Game logic
  const checkGameState = () => {
    if (energy <= 0 || stability <= 0 || coherence <= 0) {
      endGame('Game Over', 'Critical system failure! Your quantum field has collapsed.');
      return;
    }

    if (stability < 25) {
      setCurrentState(QUANTUM_STATES.CRITICAL);
    } else if (coherence < 30) {
      setCurrentState(QUANTUM_STATES.UNSTABLE);
    } else if (energy > 150) {
      setCurrentState(QUANTUM_STATES.SUPERPOSITION);
    } else {
      setCurrentState(QUANTUM_STATES.STABLE);
    }
  };

  const endGame = (title: string, description: string) => {
    setGameOver(true);
    setDialogContent({ title, description });
    setShowDialog(true);
  };

  // Game actions
  const stabilizeField = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const energyCost = 10;
    if (energy >= energyCost) {
      setEnergy(prev => prev - energyCost);
      setStability(prev => Math.min(100, prev + 15));
      setCoherence(prev => Math.min(100, prev + 5));
      setScore(prev => prev + 10);

      const response = await groqClient.chat([
        { role: 'user', content: 'Quantum field stabilization attempt performed' }
      ]);
      setAiResponse(response.content);
    }

    setIsProcessing(false);
  };

  const induceEntanglement = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const energyCost = 20;
    if (energy >= energyCost) {
      setEnergy(prev => prev - energyCost);
      setCoherence(prev => Math.min(100, prev + 20));
      setStability(prev => Math.max(0, prev - 10));
      setScore(prev => prev + 25);

      const response = await groqClient.chat([
        { role: 'user', content: 'Quantum entanglement experiment performed' }
      ]);
      setAiResponse(response.content);
    }

    setIsProcessing(false);
  };

  const chargeQuantumCore = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setEnergy(prev => Math.min(200, prev + 30));
    setStability(prev => Math.max(0, prev - 5));
    setCoherence(prev => Math.max(0, prev - 5));
    setScore(prev => prev + 15);

    const response = await groqClient.chat([
      { role: 'user', content: 'Quantum core charging initiated' }
    ]);
    setAiResponse(response.content);

    setIsProcessing(false);
  };

  // Reset game
  const resetGame = () => {
    setEnergy(INITIAL_ENERGY);
    setStability(INITIAL_STABILITY);
    setCoherence(INITIAL_COHERENCE);
    setCurrentState(QUANTUM_STATES.STABLE);
    setScore(0);
    setGameOver(false);
    setShowDialog(false);
    setAiResponse('');
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Quantum Explorer</CardTitle>
          <CardDescription>
            Manipulate quantum fields and maintain system stability
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Status Display */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <Zap className="mx-auto mb-2" />
              <div className="text-sm font-semibold">Energy</div>
              <div className="text-lg">{energy}%</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <FlaskRound className="mx-auto mb-2" />
              <div className="text-sm font-semibold">Stability</div>
              <div className="text-lg">{stability}%</div>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <Atom className="mx-auto mb-2" />
              <div className="text-sm font-semibold">Coherence</div>
              <div className="text-lg">{coherence}%</div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-lg">
              <Brain className="mx-auto mb-2" />
              <div className="text-sm font-semibold">Score</div>
              <div className="text-lg">{score}</div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={stabilizeField}
              disabled={isProcessing || gameOver || energy < 10}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Stabilize Field
            </button>
            <button
              onClick={induceEntanglement}
              disabled={isProcessing || gameOver || energy < 20}
              className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
            >
              Induce Entanglement
            </button>
            <button
              onClick={chargeQuantumCore}
              disabled={isProcessing || gameOver}
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
            >
              Charge Quantum Core
            </button>
          </div>

          {/* AI Assistant Feedback */}
          {aiResponse && (
            <Card className="mb-6 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot size={16} />
                  Quantum AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{aiResponse}</p>
              </CardContent>
            </Card>
          )}

          {/* Current State Display */}
          <div className={`text-center p-4 rounded-lg ${
            currentState === QUANTUM_STATES.STABLE ? 'bg-green-100' :
            currentState === QUANTUM_STATES.UNSTABLE ? 'bg-yellow-100' :
            currentState === QUANTUM_STATES.CRITICAL ? 'bg-red-100' :
            'bg-purple-100'
          }`}>
            <div className="font-semibold">Current Quantum State</div>
            <div className="text-lg capitalize">{currentState}</div>
          </div>
        </CardContent>
      </Card>

      {/* Game Over Dialog */}
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuantumExplorer;