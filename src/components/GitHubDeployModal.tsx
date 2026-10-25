import React, { useState } from 'react';
import {
  X,
  Github,
  Copy,
  Check,
  Terminal,
  Smartphone,
  Download,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { StorageService } from '../services/storage.ts';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/your-username/dukan-ledger.git');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const gitCommands = [
    `git remote add origin ${repoUrl}`,
    `git branch -M main`,
    `git push -u origin main`,
  ];

  const fullScript = `# Push your code to your private GitHub repository:
git init
git add .
git commit -m "feat: complete DukanLedger commercial shop rent & WhatsApp reminder app"
git remote add origin ${repoUrl}
git branch -M main
git push -u origin main`;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportBackup = () => {
    const dataStr = StorageService.exportAllDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dukanledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Github className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Private GitHub Deployment & Mobile Setup
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                Push code to GitHub & install seamlessly on iOS & Android
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {/* Step 1: Git repository instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-900 text-sm">
                1. Push to Private GitHub Repository
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Git Repo Initialized
              </span>
            </div>

            <p className="text-stone-500 mb-2">
              Enter your private GitHub repo URL below to generate the exact push commands:
            </p>

            <div className="mb-3">
              <label htmlFor="repo-url-input" className="sr-only">GitHub Repository URL</label>
              <input
                id="repo-url-input"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/<username>/<repo>.git"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/20"
              />
            </div>

            <div className="bg-stone-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] space-y-2 relative shadow-inner">
              <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
                <span>Terminal Commands</span>
                <button
                  type="button"
                  onClick={() => handleCopy(fullScript, 99)}
                  className="text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 99 ? 'Copied script' : 'Copy All'}</span>
                </button>
              </div>

              {gitCommands.map((cmd, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="text-stone-200 break-all">$ {cmd}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd, idx)}
                    className="text-stone-400 hover:text-white shrink-0 cursor-pointer p-1"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Continuous Deployment */}
          <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>2. 1-Click Cloud Deployment</span>
            </div>
            <p className="text-stone-600">
              Once pushed to GitHub, connect your private repository to <strong>Vercel</strong>, <strong>Cloudflare Pages</strong>, or <strong>Netlify</strong> for automatic SSL, zero maintenance, and custom domain hosting.
            </p>
          </div>

          {/* Step 3: Seamless Mobile Access (iOS / Android) */}
          <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50 space-y-2.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>3. Install App on your Phone (iOS & Android)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-800 block">📱 iPhone (iOS Safari)</span>
                <p className="text-stone-500 text-[11px] mt-1">
                  Tap the <strong>Share</strong> button at the bottom of Safari, then choose <strong>"Add to Home Screen"</strong>. Launches as a standalone app with no browser chrome.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-semibold text-stone-800 block">🤖 Android (Chrome)</span>
                <p className="text-stone-500 text-[11px] mt-1">
                  Tap the <strong>3-dots menu</strong> in Chrome and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong> for a native application experience.
                </p>
              </div>
            </div>
          </div>

          {/* Data Backup */}
          <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl">
            <div>
              <span className="font-semibold text-stone-900 block">Download Ledger JSON Backup</span>
              <span className="text-[11px] text-stone-500">
                Export all shop records, payment history, and reminder logs
              </span>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
