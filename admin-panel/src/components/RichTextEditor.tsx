import React, { useState } from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Code,
  FormatQuote
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface MultilingualValue {
  en: string;
  ar: string;
}

interface RichTextEditorProps {
  value: MultilingualValue;
  onChange: (value: MultilingualValue) => void;
  label: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = '',
  minRows = 10,
  maxRows = 20,
  error = false,
  helperText,
  disabled = false
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'en' | 'ar') => {
    setActiveTab(newValue);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange({
      ...value,
      [activeTab]: newValue
    });
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById(`rich-editor-${activeTab}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value[activeTab].substring(start, end);
    const beforeText = value[activeTab].substring(0, start);
    const afterText = value[activeTab].substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    
    onChange({
      ...value,
      [activeTab]: newText
    });

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    { icon: <FormatBold />, tooltip: 'Bold', before: '**', after: '**' },
    { icon: <FormatItalic />, tooltip: 'Italic', before: '*', after: '*' },
    { icon: <FormatUnderlined />, tooltip: 'Underline', before: '<u>', after: '</u>' },
    { icon: <FormatListBulleted />, tooltip: 'Bullet List', before: '- ', after: '' },
    { icon: <FormatListNumbered />, tooltip: 'Numbered List', before: '1. ', after: '' },
    { icon: <Link />, tooltip: 'Link', before: '[', after: '](url)' },
    { icon: <Image />, tooltip: 'Image', before: '![alt text](', after: ')' },
    { icon: <Code />, tooltip: 'Code', before: '`', after: '`' },
    { icon: <FormatQuote />, tooltip: 'Quote', before: '> ', after: '' },
  ];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        {label}
      </Typography>

      {/* Language Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🇺🇸 English
            </Box>
          }
          value="en"
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🇸🇦 العربية
            </Box>
          }
          value="ar"
        />
      </Tabs>

      {/* Formatting Toolbar */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {formatButtons.map((button, index) => (
          <Tooltip key={index} title={button.tooltip}>
            <IconButton
              size="small"
              onClick={() => insertFormatting(button.before, button.after)}
              disabled={disabled}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {button.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Text Editor */}
      <TextField
        id={`rich-editor-${activeTab}`}
        fullWidth
        multiline
        minRows={minRows}
        maxRows={maxRows}
        value={value[activeTab] || ''}
        onChange={handleContentChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        sx={{
          '& .MuiInputBase-root': {
            fontFamily: activeTab === 'ar' ? 'Cairo, Arial, sans-serif' : 'inherit',
            direction: activeTab === 'ar' ? 'rtl' : 'ltr',
            textAlign: activeTab === 'ar' ? 'right' : 'left'
          }
        }}
        InputProps={{
          sx: {
            fontSize: '14px',
            lineHeight: 1.6
          }
        }}
      />

      {/* Preview Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          {t('common.preview')}:
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            minHeight: 100,
            maxHeight: 200,
            overflow: 'auto',
            backgroundColor: 'grey.50',
            fontFamily: activeTab === 'ar' ? 'Cairo, Arial, sans-serif' : 'inherit',
            direction: activeTab === 'ar' ? 'rtl' : 'ltr',
            textAlign: activeTab === 'ar' ? 'right' : 'left'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              '& strong': { fontWeight: 'bold' },
              '& em': { fontStyle: 'italic' },
              '& u': { textDecoration: 'underline' },
              '& code': {
                backgroundColor: 'grey.200',
                padding: '2px 4px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }
            }}
          >
            {value[activeTab] || `${t('common.noContent')}...`}
          </Typography>
        </Paper>
      </Box>

      {/* Character Count */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {t('common.characters')}: {value[activeTab]?.length || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('common.words')}: {value[activeTab]?.split(/\s+/).filter(word => word.length > 0).length || 0}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
