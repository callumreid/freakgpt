'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ChatInterface />
    </div>
  );
}
