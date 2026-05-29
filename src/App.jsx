import { useState, useEffect } from 'react';
import { 
  Copy, Trash2, Check, Moon, Sun, Sparkles, Binary, Link, Hash, 
  Code, Search, RefreshCw, Eye, ArrowUpDown, Shuffle, FileText, Settings
} from 'lucide-react';
import {
  toTitleCase, toSentenceCase, toCamelCase, toSnakeCase, toKebabCase,
  toPascalCase, toAlternatingCase, toInverseCase, removeExtraSpaces,
  removeLineBreaks, stripHtml, removeDuplicates, removeEmptyLines,
  trimLines, base64Encode, base64Decode, urlEncode, urlDecode,
  htmlEncode, htmlDecode, toBinary, fromBinary, toHex, fromHex,
  formatJson, generateLoremIpsum, generatePassword, generateUuid, getDiff
} from './utils/textUtils';

// ==========================================
// CI/CD CANARY CONFIGURATION
// Edit these values to test your GitHub Actions / Build pipeline!
// ==========================================
export const CICD_CANARY_CONFIG = {
  version: "1.0.0",
  lastDeployDate: "2026-05-28 08:15 AM",
  environment: "Production", // e.g. "Staging", "Production", "Development"
  statusIndicatorColor: "#10b981", // Change this hex to test the status light (e.g. green: #10b981, yellow: #f59e0b, red: #ef4444)
  testSwatches: [
    { name: "Primary Swatch", color: "#ef4444" }, // Red
    { name: "Secondary Swatch", color: "#000000" }, // Black
    { name: "Accent Swatch", color: "#b91c1c" }, // Dark Red
    { name: "Success Swatch", color: "#10b981" }
  ],
  pipelinePassing: true // Toggle this boolean to see pipeline banner change
};

function App() {
  const [inputText, setInputText] = useState(
    "Welcome to TextLab! Enter your text here and watch the changes happen in real-time. You can convert letter casing, clean up spaces, encode/decode data, or generate placeholders. Check out the 'Places to Test' panel on the right to see how your text renders on buttons, tweets, credit cards, and Google search results. Have fun editing!"
  );
  const [outputText, setOutputText] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('textlab-theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('preview'); // preview, diff, analytics, findReplace
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // Generator states
  const [loremType, setLoremType] = useState('sentences');
  const [loremCount, setLoremCount] = useState(3);
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOptions, setPwdOptions] = useState({
    upper: true, lower: true, numbers: true, symbols: true
  });
  
  // Find & Replace states
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  
  // Visual Sandbox states
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState(20);
  const [textAlign, setTextAlign] = useState('center');

  // Trigger auto-transform on input change for simple state mirroring initially
  useEffect(() => {
    if (outputText === "") {
      setOutputText(inputText);
    }
  }, []);

  // Update light/dark mode class on body
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
    }
    localStorage.setItem('textlab-theme', theme);
  }, [theme]);

  const showToastMsg = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Main apply function
  const applyTransform = (transformFn, name) => {
    const result = transformFn(inputText);
    setOutputText(result);
    showToastMsg(`Applied ${name}`);
  };

  const handleCopy = (text, type = "Output") => {
    navigator.clipboard.writeText(text);
    showToastMsg(`Copied ${type} to clipboard!`);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    showToastMsg("Cleared workspace");
  };

  const handleSwap = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    showToastMsg("Swapped Input & Output");
  };

  const handleRandomPreset = () => {
    const presets = [
      "The quick brown fox jumps over the lazy dog.",
      "<h1>Heading Tag</h1>\n<p>This is standard <b>HTML</b> markup to test stripping tags.</p>",
      "{\n  \"name\": \"John Doe\",\n  \"age\": 30,\n  \"email\": \"john@example.com\",\n  \"interests\": [\"coding\", \"design\"]\n}",
      "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBCYXNlNjQgZW5jb2RlZCBzdHJpbmcgZm9yIHlvdSB0byBkZWNvZGUu",
      "01001000 01100101 01101100 01101100 01101111"
    ];
    const rand = presets[Math.floor(Math.random() * presets.length)];
    setInputText(rand);
    setOutputText(rand);
    showToastMsg("Loaded random preset");
  };

  // Find & Replace logic
  const handleFindReplace = () => {
    if (!findText) {
      showToastMsg("Please enter text to find");
      return;
    }
    try {
      let result = "";
      if (isRegex) {
        const flags = (isCaseSensitive ? "" : "i") + "g";
        const regex = new RegExp(findText, flags);
        result = inputText.replace(regex, replaceText);
      } else {
        if (isCaseSensitive) {
          result = inputText.split(findText).join(replaceText);
        } else {
          // Case insensitive literal replace
          const escapedFind = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(escapedFind, 'gi');
          result = inputText.replace(regex, replaceText);
        }
      }
      setOutputText(result);
      showToastMsg("Replacements applied to Output");
    } catch (e) {
      showToastMsg(`Regex Error: ${e.message}`);
    }
  };

  // Generators execution
  const triggerLorem = () => {
    const text = generateLoremIpsum(loremType, loremCount);
    setInputText(text);
    setOutputText(text);
    showToastMsg(`Generated ${loremCount} ${loremType}`);
  };

  const triggerPassword = () => {
    const pwd = generatePassword(pwdLength, pwdOptions);
    setInputText(pwd);
    setOutputText(pwd);
    showToastMsg("Generated strong password");
  };

  const triggerUuid = () => {
    const uuid = generateUuid();
    setInputText(uuid);
    setOutputText(uuid);
    showToastMsg("Generated UUID v4");
  };

  // Stats computation
  const getStats = (text) => {
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
    const wordCount = words.length;
    const lines = text === "" ? 0 : text.split(/\r?\n/).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readTime = Math.ceil(wordCount / 200); // 200 wpm
    const speakTime = Math.ceil(wordCount / 130); // 130 wpm
    
    return { charCount, charNoSpaces, wordCount, lines, sentences, paragraphs, readTime, speakTime };
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  // Density map computation
  const getCharacterDensity = (text) => {
    if (!text) return [];
    const counts = {};
    const cleanText = text.toLowerCase().replace(/\s/g, '');
    for (let char of cleanText) {
      counts[char] = (counts[char] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8); // Top 8 characters
  };

  const densityMap = getCharacterDensity(outputText);
  const maxDensityCount = densityMap.length > 0 ? densityMap[0][1] : 1;

  // Twitter visual check
  const twitterLimit = 280;
  const twitterLeft = twitterLimit - outputText.length;
  const twitterPercent = Math.min((outputText.length / twitterLimit) * 100, 100);
  
  return (
    <>
      <header>
        <div className="logo-section">
          <div className="logo-icon">TL</div>
          <div className="logo-text">
            <h1>TextLab</h1>
            <p>The developer's text sandbox & formatter</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleRandomPreset} title="Load a random text preset">
            <Shuffle size={16} /> Presets
          </button>
          <button className="btn-icon" onClick={toggleTheme} title="Toggle dark/light mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="app-grid">
        {/* Column 1: Manipulation Tools */}
        <aside className="glass-card">
          <h2 className="card-title"><Settings size={18} /> Toolbox</h2>
          
          {/* Case options */}
          <div className="tool-group">
            <div className="tool-group-title">Case Conversions</div>
            <div className="tool-buttons-grid">
              <button className="tool-btn" onClick={() => applyTransform(str => str.toUpperCase(), "UPPERCASE")}>
                UPPERCASE
              </button>
              <button className="tool-btn" onClick={() => applyTransform(str => str.toLowerCase(), "lowercase")}>
                lowercase
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toTitleCase, "Title Case")}>
                Title Case
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toSentenceCase, "Sentence Case")}>
                Sentence case
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toCamelCase, "camelCase")}>
                camelCase
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toSnakeCase, "snake_case")}>
                snake_case
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toKebabCase, "kebab-case")}>
                kebab-case
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toPascalCase, "PascalCase")}>
                PascalCase
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toAlternatingCase, "aLtErNaTiNg")}>
                Alternating
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toInverseCase, "Swapped Case")}>
                Swap case
              </button>
            </div>
          </div>

          {/* Clean Up options */}
          <div className="tool-group">
            <div className="tool-group-title">Clean Up & Trim</div>
            <div className="tool-buttons-grid">
              <button className="tool-btn" onClick={() => applyTransform(removeExtraSpaces, "Trim Extra Spaces")}>
                Remove Spaces
              </button>
              <button className="tool-btn" onClick={() => applyTransform(removeLineBreaks, "Collapse Line Breaks")}>
                Remove Breaks
              </button>
              <button className="tool-btn" onClick={() => applyTransform(stripHtml, "HTML Stripper")}>
                Strip HTML
              </button>
              <button className="tool-btn" onClick={() => applyTransform(removeDuplicates, "Duplicate Line Remover")}>
                Unique Lines
              </button>
              <button className="tool-btn" onClick={() => applyTransform(removeEmptyLines, "Empty Line Remover")}>
                Remove Empties
              </button>
              <button className="tool-btn" onClick={() => applyTransform(trimLines, "Trim Line Ends")}>
                Trim Lines
              </button>
            </div>
          </div>

          {/* Encode options */}
          <div className="tool-group">
            <div className="tool-group-title">Encoders & Formatter</div>
            <div className="tool-buttons-grid">
              <button className="tool-btn" onClick={() => applyTransform(base64Encode, "Base64 Encode")}>
                Base64 Enc
              </button>
              <button className="tool-btn" onClick={() => applyTransform(base64Decode, "Base64 Decode")}>
                Base64 Dec
              </button>
              <button className="tool-btn" onClick={() => applyTransform(urlEncode, "URL Encode")}>
                URL Encode
              </button>
              <button className="tool-btn" onClick={() => applyTransform(urlDecode, "URL Decode")}>
                URL Decode
              </button>
              <button className="tool-btn" onClick={() => applyTransform(htmlEncode, "HTML Encode")}>
                HTML Enc
              </button>
              <button className="tool-btn" onClick={() => applyTransform(htmlDecode, "HTML Decode")}>
                HTML Dec
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toBinary, "Binary Encode")}>
                To Binary
              </button>
              <button className="tool-btn" onClick={() => applyTransform(fromBinary, "Binary Decode")}>
                From Binary
              </button>
              <button className="tool-btn" onClick={() => applyTransform(toHex, "Hex Encode")}>
                To Hex
              </button>
              <button className="tool-btn" onClick={() => applyTransform(fromHex, "Hex Decode")}>
                From Hex
              </button>
              <button className="tool-btn" onClick={() => applyTransform(str => formatJson(str, 2), "JSON Format")}>
                JSON Format
              </button>
            </div>
          </div>

          {/* Generators options */}
          <div className="tool-group">
            <div className="tool-group-title">Data Generators</div>
            <div className="tool-buttons-grid">
              <button className="tool-btn" onClick={triggerLorem}>
                <Sparkles size={12} /> Lorem Ipsum
              </button>
              <button className="tool-btn" onClick={triggerPassword}>
                <Sparkles size={12} /> Password
              </button>
              <button className="tool-btn" onClick={triggerUuid}>
                <Sparkles size={12} /> UUID v4
              </button>
            </div>
            
            {/* generator details */}
            <div className="generator-options">
              <div className="option-row">
                <label>Lorem Type</label>
                <select value={loremType} onChange={e => setLoremType(e.target.value)}>
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                  <option value="paragraphs">Paragraphs</option>
                </select>
              </div>
              <div className="option-row">
                <label>Lorem Count</label>
                <input type="number" min="1" max="100" value={loremCount} onChange={e => setLoremCount(parseInt(e.target.value) || 1)} />
              </div>
              <div className="option-row">
                <label>Pwd Length</label>
                <input type="number" min="6" max="64" value={pwdLength} onChange={e => setPwdLength(parseInt(e.target.value) || 6)} />
              </div>
              <div className="option-row">
                <label>Pwd Numbers</label>
                <input type="checkbox" checked={pwdOptions.numbers} onChange={e => setPwdOptions(prev => ({...prev, numbers: e.target.checked}))} />
              </div>
              <div className="option-row">
                <label>Pwd Symbols</label>
                <input type="checkbox" checked={pwdOptions.symbols} onChange={e => setPwdOptions(prev => ({...prev, symbols: e.target.checked}))} />
              </div>
            </div>
          </div>
        </aside>

        {/* Column 2: Editor Workspace */}
        <main className="editor-workspace">
          {/* Input text box */}
          <div className="glass-card">
            <div className="editor-header">
              <h2 className="card-title" style={{marginBottom: 0}}><FileText size={18} /> Input Workspace</h2>
              <div className="editor-actions">
                <button className="btn-icon" onClick={() => handleCopy(inputText, "Input")} title="Copy Input text">
                  <Copy size={14} />
                </button>
                <button className="btn-icon" onClick={handleClear} title="Clear Workspace">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="textarea-container">
              <textarea
                className="editor-textarea"
                placeholder="Type or paste your text here..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  // By default, if user edits input directly, mirror it to output unless a transform is active
                  setOutputText(e.target.value);
                }}
              />
            </div>
            <div className="editor-footer">
              <div className="stats-badges">
                <div className="stat-badge">Characters: <span>{inputStats.charCount}</span></div>
                <div className="stat-badge">Words: <span>{inputStats.wordCount}</span></div>
                <div className="stat-badge">Lines: <span>{inputStats.lines}</span></div>
              </div>
            </div>
          </div>

          {/* Swap divider */}
          <div className="swap-separator">
            <button className="swap-btn" onClick={handleSwap} title="Swap Input and Output text">
              <ArrowUpDown size={16} />
            </button>
          </div>

          {/* Output text box */}
          <div className="glass-card">
            <div className="editor-header">
              <h2 className="card-title" style={{marginBottom: 0}}><FileText size={18} /> Output Workspace</h2>
              <div className="editor-actions">
                <button className="btn-icon" onClick={() => handleCopy(outputText, "Output")} title="Copy Output text">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="textarea-container">
              <textarea
                className="editor-textarea"
                placeholder="Output text will appear here..."
                value={outputText}
                readOnly
              />
            </div>
            <div className="editor-footer">
              <div className="stats-badges">
                <div className="stat-badge">Characters: <span>{outputStats.charCount}</span></div>
                <div className="stat-badge">Words: <span>{outputStats.wordCount}</span></div>
                <div className="stat-badge">Lines: <span>{outputStats.lines}</span></div>
              </div>
            </div>
          </div>
        </main>

        {/* Column 3: Previews and Testing Labs */}
        <section className="glass-card sandbox-column">
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
              <Eye size={14} /> Places to Test
            </button>
            <button className={`tab-btn ${activeTab === 'diff' ? 'active' : ''}`} onClick={() => setActiveTab('diff')}>
              <Code size={14} /> Diff Checker
            </button>
            <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <FileText size={14} /> Analytics
            </button>
            <button className={`tab-btn ${activeTab === 'findReplace' ? 'active' : ''}`} onClick={() => setActiveTab('findReplace')}>
              <Search size={14} /> Find & Replace
            </button>
          </div>

          {/* Tab Content: Previews Sandbox */}
          {activeTab === 'preview' && (
            <div className="sandbox-grid">
              
              {/* Google Search Mockup */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Google Search Snippet Preview</span>
                  <span>{outputText.length}/160 chars</span>
                </div>
                <div className="google-search-mock">
                  <div className="google-url">
                    https://textlab.dev <span style={{fontSize: '10px', color: 'var(--text-muted)'}}>▼</span>
                  </div>
                  <a href="#test" className="google-title" onClick={e => e.preventDefault()}>
                    {outputText.slice(0, 60) || "TextLab - Modern Developer Tool"}
                    {outputText.length > 60 ? "..." : ""}
                  </a>
                  <div className="google-desc">
                    {outputText.slice(0, 155) || "Please type or transform text in the left workspace to see how it formats inside Google's search result snippet."}
                    {outputText.length > 155 ? "..." : ""}
                  </div>
                </div>
              </div>

              {/* Twitter X Mockup */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Social Media Post (X/Twitter Mockup)</span>
                  <span>{twitterLeft} characters left</span>
                </div>
                <div className="twitter-mock">
                  <div className="twitter-user">
                    <div className="twitter-avatar">TL</div>
                    <div className="twitter-names">
                      <div className="twitter-name">TextLab User</div>
                      <div className="twitter-handle">@textlab_tester</div>
                    </div>
                  </div>
                  <div className="twitter-body">
                    {outputText || "Your transformed text will appear here as a tweet. Check the character counter to make sure it fits within the limit!"}
                  </div>
                  <div className="twitter-footer">
                    <span>10:42 AM · May 28, 2026</span>
                    <div className="twitter-char-indicator">
                      <div 
                        className={`twitter-char-circle ${twitterLeft < 20 ? (twitterLeft < 0 ? 'danger' : 'warning') : ''}`}
                        style={{
                          background: `conic-gradient(var(--accent-color) ${twitterPercent}%, transparent ${twitterPercent}%)`
                        }}
                      />
                      <span style={{color: twitterLeft < 0 ? 'var(--error)' : 'var(--text-secondary)'}}>
                        {outputText.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SMS bubble */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Chat bubble rendering</span>
                </div>
                <div className="sms-mock">
                  <div className="sms-bubble incoming">
                    Hey! Can you send me the formatted text?
                  </div>
                  <div className="sms-bubble outgoing">
                    {outputText || "Here is your transformed text!"}
                  </div>
                </div>
              </div>

              {/* Glassmorphic Credit Card */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Mock Credit Card Holder Name</span>
                </div>
                <div className="credit-card-mock">
                  <div className="card-chip"></div>
                  <div className="card-number">••••  ••••  ••••  4285</div>
                  <div className="card-details">
                    <div>
                      <div className="card-label">CARD HOLDER</div>
                      <div className="card-holder-name">
                        {outputText.slice(0, 26).toUpperCase() || "YOUR NAME HERE"}
                      </div>
                    </div>
                    <div className="card-expiry">
                      <div className="card-label">EXPIRES</div>
                      <div className="card-value">12/31</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction widgets */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Interactive Elements UI Preview</span>
                </div>
                <div className="widgets-mock">
                  <label style={{fontSize: '11px', color: 'var(--text-secondary)'}}>Button Label Testing:</label>
                  <button className="mock-button" onClick={() => showToastMsg("Tested interactive button click!")}>
                    {outputText.slice(0, 40) || "Click Me"}
                  </button>
                  
                  <label style={{fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px'}}>Input Placeholder Testing:</label>
                  <input className="mock-input" readOnly placeholder={outputText || "Enter text here..."} />
                </div>
              </div>

              {/* Presentation Typography Banner */}
              <div className="sandbox-item">
                <div className="sandbox-item-header">
                  <span>Typography Display Sandbox</span>
                </div>
                <div className="banner-mock">
                  <div 
                    className="banner-text" 
                    style={{
                      fontFamily: fontFamily === 'serif' ? 'Georgia, serif' : fontFamily === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
                      fontSize: `${fontSize}px`,
                      textAlign: textAlign
                    }}
                  >
                    {outputText || "Type text to see presentation style"}
                  </div>
                  <div className="typography-controls">
                    <select className="typo-select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
                      <option value="sans-serif">Sans-Serif</option>
                      <option value="serif">Serif Font</option>
                      <option value="mono">Monospace</option>
                    </select>
                    <select className="typo-select" value={textAlign} onChange={e => setTextAlign(e.target.value)}>
                      <option value="center">Align Center</option>
                      <option value="left">Align Left</option>
                      <option value="right">Align Right</option>
                    </select>
                    <input 
                      type="range" 
                      min="12" 
                      max="36" 
                      value={fontSize} 
                      onChange={e => setFontSize(parseInt(e.target.value))}
                      style={{accentColor: 'var(--accent-color)', width: '80px'}}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab Content: Diff Checker */}
          {activeTab === 'diff' && (
            <div>
              <div style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', textAlign: 'left'}}>
                Shows line-by-line diff comparisons between the <strong>Input</strong> (original) and the <strong>Output</strong> (modified) workspace:
              </div>
              <div className="diff-container">
                {getDiff(inputText, outputText).map((chunk, index) => (
                  <div key={index} className={`diff-line ${chunk.type}`}>
                    <span style={{width: '20px', display: 'inline-block', opacity: 0.5, userSelect: 'none'}}>
                      {chunk.type === 'added' ? '+' : chunk.type === 'deleted' ? '-' : ' '}
                    </span>
                    {chunk.text || ' '}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Analytics */}
          {activeTab === 'analytics' && (
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-card-title">Reading Time</div>
                <div className="stat-card-value">~ {outputStats.readTime} min</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Speaking Time</div>
                <div className="stat-card-value">~ {outputStats.speakTime} min</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Total Lines</div>
                <div className="stat-card-value">{outputStats.lines}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Sentences</div>
                <div className="stat-card-value">{outputStats.sentences}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Paragraphs</div>
                <div className="stat-card-value">{outputStats.paragraphs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Non-Space Characters</div>
                <div className="stat-card-value">{outputStats.charNoSpaces}</div>
              </div>

              {/* Density Map section */}
              <div className="stat-card density-section">
                <div className="stat-card-title" style={{marginBottom: '10px'}}>Top Character Density</div>
                {densityMap.length === 0 ? (
                  <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>No characters to analyze yet.</div>
                ) : (
                  <div className="density-list">
                    {densityMap.map(([char, count]) => {
                      const percentage = (count / maxDensityCount) * 100;
                      return (
                        <div key={char} className="density-bar-row">
                          <span className="density-char">'{char}'</span>
                          <div className="density-bar-container">
                            <div className="density-bar-fill" style={{width: `${percentage}%`}} />
                          </div>
                          <span className="density-count">{count}x</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content: Find & Replace */}
          {activeTab === 'findReplace' && (
            <div className="find-replace-container">
              <div className="input-group">
                <label>Find Text / Pattern</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. hello"
                  value={findText} 
                  onChange={e => setFindText(e.target.value)} 
                />
              </div>
              
              <div className="input-group">
                <label>Replace With</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. world"
                  value={replaceText} 
                  onChange={e => setReplaceText(e.target.value)} 
                />
              </div>

              <div style={{display: 'flex', gap: '20px', margin: '6px 0'}}>
                <label className="checkbox-label">
                  <input type="checkbox" checked={isRegex} onChange={e => setIsRegex(e.target.checked)} />
                  Use Regular Expression
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={isCaseSensitive} onChange={e => setIsCaseSensitive(e.target.checked)} />
                  Case Sensitive
                </label>
              </div>

              <button className="btn-primary" onClick={handleFindReplace} style={{alignSelf: 'flex-start', marginTop: '6px'}}>
                Apply Replacements
              </button>
            </div>
          )}
        </section>
      </div>

      {/* CI/CD Build Canary Card */}
      <section className="glass-card canary-card" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div className="canary-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="canary-pulse-dot" style={{ backgroundColor: CICD_CANARY_CONFIG.statusIndicatorColor }}></span>
              CI/CD Build & Deployment Canary
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Verify your deployment pipelines instantly! Open <code>src/App.jsx</code>, modify the <code>CICD_CANARY_CONFIG</code> values, and push.
            </p>
          </div>
          <div className="canary-meta-badges">
            <span className="canary-badge">Env: <strong>{CICD_CANARY_CONFIG.environment}</strong></span>
            <span className="canary-badge">Version: <strong>v{CICD_CANARY_CONFIG.version}</strong></span>
            <span className="canary-badge">Updated: <strong>{CICD_CANARY_CONFIG.lastDeployDate}</strong></span>
          </div>
        </div>

        <div className="canary-body" style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Color Swatch & Artifact Verification
          </div>
          <div className="canary-swatches-grid">
            {CICD_CANARY_CONFIG.testSwatches.map((swatch, idx) => (
              <div key={idx} className="canary-swatch-item">
                <div 
                  className="canary-swatch-box" 
                  style={{ backgroundColor: swatch.color }}
                  onClick={() => {
                    navigator.clipboard.writeText(swatch.color);
                    showToastMsg(`Copied ${swatch.color} to clipboard!`);
                  }}
                  title="Click to copy hex"
                >
                  <span className="canary-swatch-hex">{swatch.color}</span>
                </div>
                <span className="canary-swatch-name">{swatch.name}</span>
              </div>
            ))}
          </div>

          <div className="canary-pipeline-status" style={{ borderLeftColor: CICD_CANARY_CONFIG.pipelinePassing ? 'var(--success)' : 'var(--error)' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              CI/CD Pipeline Status:
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: CICD_CANARY_CONFIG.pipelinePassing ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              ● {CICD_CANARY_CONFIG.pipelinePassing ? "PIPELINE PASSING & DEPLOYED" : "PIPELINE TESTING / FAILED"}
            </div>
          </div>
        </div>
      </section>

      {/* Floating toast notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <Check size={16} className="toast-success-icon" />
        <span>{toast.message}</span>
      </div>

      <footer>
        <p>© 2026 TextLab. Designed with rich glassmorphism & live testing sandboxes.</p>
      </footer>
    </>
  );
}

export default App;
