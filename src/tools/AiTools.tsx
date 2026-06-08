import React, { useState } from 'react';
import { Sparkles, Key, Check, Copy } from 'lucide-react';

export const AiGenerator: React.FC = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [toolType, setToolType] = useState('cover-letter'); // cover-letter | resume | email | caption
  const [promptInput, setPromptInput] = useState('');
  const [tone, setTone] = useState('professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAIContent = async () => {
    if (!promptInput.trim()) return;
    setLoading(true);

    if (apiKey.trim()) {
      // Real API generation with Gemini API key
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert content creator. Generate a ${toolType.replace('-', ' ')} based on these details: "${promptInput}". Make it have a ${tone} tone. Return only the generated document. Do not include markdown code block markers.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          setOutput(data.candidates[0].content.parts[0].text);
        } else {
          throw new Error(data.error?.message || 'Failed to generate content. Please verify your API Key.');
        }
      } catch (err: any) {
        setOutput(`⚠️ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      // High fidelity client-side mock fallback
      setTimeout(() => {
        let text = '';
        if (toolType === 'cover-letter') {
          text = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the position described. With my background in the industry, I am confident in my ability to make an immediate impact on your team. 

My experiences have equipped me with a robust set of skills, specifically aligned with "${promptInput}". I approach my work with a ${tone} attitude, ensuring deliverables are met with the highest quality and collaboration.

Thank you for your time and consideration. I look forward to discussing how my skills align with your current goals.

Sincerely,
[Your Name]`;
        } else if (toolType === 'resume') {
          text = `PROFESSIONAL SUMMARY
Highly motivated professional seeking to leverage skills in "${promptInput}". Proven track record of delivering results under a ${tone} execution style. Adept at collaborative problem solving and optimizing workflows.`;
        } else if (toolType === 'email') {
          text = `Subject: Quick Update re: Details

Dear Team,

I hope you are doing well.

Regarding the current task: "${promptInput}". I want to ensure we align our processes to complete this in a ${tone} manner. Please let me know your thoughts or feedback.

Best regards,
[Your Name]`;
        } else {
          text = `✨ Excited to share updates on "${promptInput}"! Keeping things ${tone} and moving forward! 🚀 #productivity #career #innovation`;
        }
        setOutput(text);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles className="text-gradient" /> AI Productivity Assistant
      </h3>

      {/* API Key management */}
      <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Key size={16} className="text-gradient" />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gemini API Key (Optional):</span>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste API Key here..."
          style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', minWidth: '150px' }}
        />
        <button className="btn-primary" onClick={saveApiKey} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          {keySaved ? 'Saved!' : 'Save Key'}
        </button>
        {apiKey && (
          <button className="btn-secondary" onClick={clearApiKey} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger)', color: '#fff' }}>
            Clear
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>AI Tool Mode</label>
              <select value={toolType} onChange={(e) => setToolType(e.target.value)}>
                <option value="cover-letter">Cover Letter Writer</option>
                <option value="resume">Resume Summary Gen</option>
                <option value="email">Professional Email Writer</option>
                <option value="caption">Social Media Caption</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="casual">Casual</option>
                <option value="excited">Excited</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Core details (e.g. job description, email topic)</label>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. React Developer with 3 years experience..."
              style={{ height: '100px', resize: 'none' }}
            />
          </div>

          <button className="btn-primary" onClick={generateAIContent} style={{ width: '100%' }} disabled={loading}>
            <Sparkles size={16} /> {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem' }}>AI Draft Results</label>
            {output && (
              <button onClick={handleCopy} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}>
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            style={{ width: '100%', height: '190px', fontFamily: 'inherit', fontSize: '0.85rem', backgroundColor: 'var(--bg-tertiary)', resize: 'none' }}
            placeholder="Generated document text appears here..."
          />
        </div>
      </div>
    </div>
  );
};
