# AI Translator Chrome Extension

A powerful Chrome extension that provides intelligent translation using OpenAI's GPT models. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### 🚀 Smart Translation
- **Auto-detect mode**: Automatically detects language and translates between your primary and secondary languages
- **Manual language selection**: Choose specific source and target languages from 100+ supported languages
- **Real-time translation**: Translates as you type with a 1-second delay
- **Phonetic transcription**: Provides pronunciation guide for translated text

### 🎨 Modern UI
- **Dark/Light mode**: Toggle between themes
- **Responsive design**: Clean, modern interface optimized for Chrome extension popup
- **Tailwind CSS**: Beautiful, consistent styling
- **Lucide icons**: Modern iconography

### 🔧 Smart Language Logic
- **Primary/Secondary languages**: Set your main language pair in settings
- **Intelligent auto-detection**:
  - If text is in primary language → translates to secondary
  - If text is in secondary language → translates to primary
  - If text is in other language → translates to secondary
- **Fallback handling**: Graceful handling of translation errors and edge cases

### 📋 Convenience Features
- **Copy to clipboard**: One-click copying of translations
- **Selected text translation**: Get selected text from web pages (via content script)
- **Context menu integration**: Right-click to translate selected text
- **Persistent settings**: Language preferences saved locally

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo
- **Extension**: Chrome Manifest V3

## Project Structure

```
translator/
├── public/
│   ├── manifest.json          # Chrome extension manifest
│   └── icons/                 # Extension icons
├── src/
│   ├── popup/
│   │   ├── index.html         # Popup HTML entry point
│   │   ├── index.tsx          # Popup React entry point
│   │   ├── Popup.tsx          # Main popup component
│   │   ├── Options.tsx        # Language selector component
│   │   ├── languages.ts       # Supported languages list
│   │   └── api.ts            # OpenAI API configuration
│   ├── background.ts          # Service worker script
│   ├── content.ts            # Content script for page interaction
│   └── index.css             # Global styles
├── vite.config.ts            # Vite configuration
└── package.json
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Chrome browser
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API**
   - Create `src/popup/api.ts` file:
   ```typescript
   export const API_KEY = 'your-openai-api-key-here';
   ```

4. **Build the extension**
   ```bash
   npm run build
   ```

5. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Development Workflow

1. **Start development**
   ```bash
   npm run dev
   ```

2. **Make changes** to source files

3. **Build and reload** extension in Chrome
   ```bash
   npm run build
   ```

4. **Test** the extension functionality

## Configuration

### Language Settings
- **Primary Language**: Your main language (default: Russian)
- **Secondary Language**: Your target language (default: English)
- Settings are automatically saved to localStorage

### Auto-detect Logic
The extension uses intelligent language detection:

| Source Language | Target Language | Behavior |
|----------------|----------------|----------|
| Auto-detect | Auto-detect | Smart detection: primary ↔ secondary |
| Auto-detect | Specific | Detect source → translate to specific |
| Specific | Auto-detect | Specific → secondary language |
| Specific | Specific | Direct translation |

## API Integration

The extension uses OpenAI's GPT-3.5-turbo model with structured prompts:

```typescript
// Example prompt for auto-detection
`Detect the language of the following text and translate it intelligently:
- If the text is in ${primaryLanguage}, translate it to ${secondaryLanguage}
- If the text is in ${secondaryLanguage}, translate it to ${primaryLanguage}
- If the text is in any other language, translate it to ${secondaryLanguage}

Return only the translation and transcription...`
```

## Browser Permissions

The extension requires these permissions:
- `activeTab` - Access current tab for selected text
- `scripting` - Inject content scripts
- `storage` - Save user preferences
- `contextMenus` - Right-click translation menu

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed and TypeScript files are valid
2. **Extension not loading**: Check that manifest.json is valid and all referenced files exist
3. **Translation not working**: Verify OpenAI API key is correctly configured
4. **Popup not opening**: Check for console errors and ensure React components are properly built

### Debug Mode

Enable debug logging by checking browser console in the extension popup (F12 → Console).

## Roadmap

- [ ] Support for more AI providers (Anthropic, Google Translate)
- [ ] Offline translation capabilities
- [ ] Translation history
- [ ] Custom language pairs
- [ ] Voice input/output
- [ ] PDF translation support