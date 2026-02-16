
export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum IOCType {
  IP = 'IP',
  DOMAIN = 'DOMAIN',
  HASH = 'HASH',
  URL = 'URL',
  EMAIL = 'EMAIL'
}

export interface ThreatActor {
  id: string;
  name: string;
  origin: string;
  motivation: string;
  ttps: string[];
  severity: Severity;
  lastActive: string;
  description: string;
}

export interface IOC {
  id: string;
  value: string;
  type: IOCType;
  confidence: number;
  tags: string[];
  lastSeen: string;
  status: 'Active' | 'Revoked' | 'Inactive';
}

export interface Vulnerability {
  cve: string;
  score: number;
  description: string;
  exploitAvailable: boolean;
  publishedDate: string;
}

export interface ForumPost {
  id: string;
  user: string;
  forum: string;
  post: string;
  date: string;
  details: string;
}

export interface ChatMessage {
  id: string;
  date: string;
  user: string;
  chat: string;
  source: 'Telegram' | 'Discord' | 'WhatsApp';
  message: string;
}

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  steps: PlaybookStep[];
}
